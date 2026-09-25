import json

files = {
    "Homepage Mobile":    "/tmp/psi_home_mobile.json",
    "Homepage Desktop":   "/tmp/psi_home_desktop.json",
    "Category Mobile":    "/tmp/psi_cat_mobile.json",
    "Category Desktop":   "/tmp/psi_cat_desktop.json",
    "Product Mobile":     "/tmp/psi_product_mobile.json",
    "Product Desktop":    "/tmp/psi_product_desktop.json",
    "Blog Mobile":        "/tmp/psi_blog_mobile.json",
    "Blog Desktop":       "/tmp/psi_blog_desktop.json",
    "Brand Mobile":       "/tmp/psi_brand_mobile.json",
    "Brand Desktop":      "/tmp/psi_brand_desktop.json",
}

def get_nested(d, *keys):
    for k in keys:
        if isinstance(d, dict):
            d = d.get(k)
        else:
            return None
    return d

def cwv_status(metric, value):
    if value is None: return "N/A  "
    if metric == "lcp":
        if value <= 2500: return "GOOD "
        if value <= 4000: return "NI   "
        return "POOR "
    if metric == "cls":
        if value <= 0.1: return "GOOD "
        if value <= 0.25: return "NI   "
        return "POOR "
    if metric == "inp":
        if value <= 200: return "GOOD "
        if value <= 500: return "NI   "
        return "POOR "
    return "     "

def fmt_ms(v, unit="ms"):
    if v is None: return "N/A"
    if unit == "s": return f"{v/1000:.2f}s"
    return f"{int(v)}ms"

for label, path in files.items():
    with open(path) as f:
        data = json.load(f)
    lhr = data.get("lighthouseResult", {})
    if not lhr:
        err = data.get("error", {}).get("message", "unknown error")
        print(f"\n{label}: ERROR - {err}")
        continue

    score = get_nested(lhr, "categories", "performance", "score")
    score_str = f"{int(score*100)}/100" if score is not None else "N/A"

    lcp_ms  = get_nested(lhr, "audits", "largest-contentful-paint", "numericValue")
    cls_val = get_nested(lhr, "audits", "cumulative-layout-shift", "numericValue")
    inp_ms  = get_nested(lhr, "audits", "interaction-to-next-paint", "numericValue")
    ttfb_ms = get_nested(lhr, "audits", "server-response-time", "numericValue")
    tbt_ms  = get_nested(lhr, "audits", "total-blocking-time", "numericValue")
    fcp_ms  = get_nested(lhr, "audits", "first-contentful-paint", "numericValue")

    print(f"\n{'='*60}")
    print(f"  {label}   |   Score: {score_str}")
    print(f"{'='*60}")
    print(f"  LCP  : {fmt_ms(lcp_ms,'s'):>8}   [{cwv_status('lcp', lcp_ms)}]  target <=2.5s")
    print(f"  INP  : {fmt_ms(inp_ms):>8}   [{cwv_status('inp', inp_ms)}]  target <=200ms")
    print(f"  CLS  : {(f'{cls_val:.3f}' if cls_val is not None else 'N/A'):>8}   [{cwv_status('cls', cls_val)}]  target <=0.1")
    print(f"  FCP  : {fmt_ms(fcp_ms,'s'):>8}")
    print(f"  TTFB : {fmt_ms(ttfb_ms,'s'):>8}")
    print(f"  TBT  : {fmt_ms(tbt_ms):>8}")

# Also extract top opportunities
print("\n\n" + "="*60)
print("  TOP AUDIT OPPORTUNITIES (mobile pages)")
print("="*60)
mobile_files = {k: v for k, v in files.items() if "Mobile" in k}
opportunity_map = {}
for label, path in mobile_files.items():
    with open(path) as f:
        data = json.load(f)
    lhr = data.get("lighthouseResult", {})
    if not lhr:
        continue
    audits = lhr.get("audits", {})
    opps = []
    for audit_id, audit in audits.items():
        details = audit.get("details", {})
        if details.get("type") == "opportunity":
            savings = audit.get("numericValue", 0) or 0
            if savings > 200:
                opps.append((audit.get("title", audit_id), int(savings), audit.get("score", 1)))
    opps.sort(key=lambda x: -x[1])
    if opps:
        print(f"\n  {label}:")
        for title, savings, score in opps[:6]:
            flag = " ***" if score is not None and score < 0.5 else ""
            print(f"    -{savings}ms  {title}{flag}")
