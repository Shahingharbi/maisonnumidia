"""
Screenshot capture script for maisonnumidia.store visual audit.
Usage: python scripts/capture_screenshot.py
"""
from playwright.sync_api import sync_playwright
import os

OUTPUT_DIR = "C:/Users/superindep/maisonnumidia/screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

VIEWPORTS = {
    "desktop": {"width": 1280, "height": 900},
    "mobile": {"width": 375, "height": 812},
}

PAGES = {
    "homepage": "https://maisonnumidia.store",
    "category_homme": "https://maisonnumidia.store/parfums-homme",
    "product": "https://maisonnumidia.store/parfums-homme/dior-sauvage",
}


def capture(page, url, output_path, viewport):
    page.set_viewport_size(viewport)
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(2000)
    page.screenshot(path=output_path, full_page=False)
    print(f"Saved: {output_path}")


def capture_mobile_menu(page, url, output_path):
    page.set_viewport_size({"width": 375, "height": 812})
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(1500)
    # Try to click the hamburger/menu button
    try:
        # Common selectors for mobile menu toggles
        for selector in ["button[aria-label*='menu']", "button[aria-label*='Menu']",
                          "[data-testid='mobile-menu']", "button.hamburger",
                          "button[class*='menu']", "button[class*='burger']",
                          "nav button", "#mobile-menu-button"]:
            btn = page.query_selector(selector)
            if btn:
                btn.click()
                page.wait_for_timeout(800)
                print(f"Clicked menu button: {selector}")
                break
        else:
            print("No menu button found by selector — trying first nav button")
            btns = page.query_selector_all("nav button, header button")
            if btns:
                btns[0].click()
                page.wait_for_timeout(800)
    except Exception as e:
        print(f"Menu click error: {e}")
    page.screenshot(path=output_path, full_page=False)
    print(f"Saved: {output_path}")


def get_dom_info(page):
    """Extract DOM info for accessibility checks."""
    info = page.evaluate("""() => {
        const results = {};
        // Check for star ratings
        results.hasStars = !!document.querySelector('[class*="star"], [class*="rating"], .fa-star, svg[class*="star"]');
        // Check for promo badges
        const badges = [...document.querySelectorAll('[class*="badge"], [class*="promo"], [class*="discount"]')];
        results.promoBadges = badges.map(b => b.textContent.trim()).filter(t => t.length > 0);
        // Check WhatsApp button
        const wa = document.querySelector('a[href*="wa.me"], a[href*="whatsapp"], [class*="whatsapp"]');
        results.whatsappButton = wa ? {found: true, text: wa.textContent.trim().slice(0,50)} : {found: false};
        // Check logo
        const logo = document.querySelector('img[src*="logo"], img[alt*="logo"], img[alt*="Maison"]');
        results.logoFound = !!logo;
        // Check H1
        const h1 = document.querySelector('h1');
        results.h1Text = h1 ? h1.textContent.trim().slice(0,100) : null;
        // Check for horizontal overflow
        results.bodyScrollWidth = document.body.scrollWidth;
        results.windowWidth = window.innerWidth;
        results.hasHorizontalScroll = document.body.scrollWidth > window.innerWidth + 5;
        // Nav links HTML presence (not JS conditional)
        const navLinks = document.querySelectorAll('header a, nav a');
        results.navLinksCount = navLinks.length;
        results.navLinks = [...navLinks].map(a => ({href: a.href, text: a.textContent.trim().slice(0,40)})).slice(0,20);
        // Mobile tap targets
        const buttons = [...document.querySelectorAll('button, a, [role="button"]')];
        const smallTargets = buttons.filter(b => {
            const r = b.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44);
        });
        results.smallTapTargets = smallTargets.length;
        return results;
    }""")
    return info


def check_product_page(page):
    """Product-specific checks."""
    return page.evaluate("""() => {
        const price = document.querySelector('[class*="price"], .price, [data-price]');
        const cta = document.querySelector('button[class*="commander"], button[class*="order"], button[class*="cart"], button[class*="panier"], [class*="add-to-cart"]');
        const breadcrumb = document.querySelector('[class*="breadcrumb"], nav[aria-label*="breadcrumb"], ol.breadcrumb');
        const mainImage = document.querySelector('.product-image img, [class*="product"] img, main img');
        const stars = document.querySelector('[class*="star-rating"], [class*="rating"] [class*="star"]');
        return {
            priceText: price ? price.textContent.trim().slice(0,40) : null,
            ctaText: cta ? cta.textContent.trim().slice(0,60) : null,
            hasBreadcrumb: !!breadcrumb,
            mainImageSrc: mainImage ? mainImage.src.slice(0,80) : null,
            hasStarRating: !!stars,
        };
    }""")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        results = {}

        # --- DESKTOP CAPTURES ---
        for page_key, url in PAGES.items():
            ctx = browser.new_context(viewport=VIEWPORTS["desktop"])
            page = ctx.new_page()
            out = f"{OUTPUT_DIR}/{page_key}_desktop.png"
            capture(page, url, out, VIEWPORTS["desktop"])
            if page_key == "homepage":
                results["desktop_homepage_dom"] = get_dom_info(page)
            if page_key == "product":
                results["product_dom"] = check_product_page(page)
            page.close()
            ctx.close()

        # --- MOBILE CAPTURES ---
        for page_key, url in PAGES.items():
            ctx = browser.new_context(
                viewport=VIEWPORTS["mobile"],
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
            )
            page = ctx.new_page()
            out = f"{OUTPUT_DIR}/{page_key}_mobile.png"
            capture(page, url, out, VIEWPORTS["mobile"])
            if page_key == "homepage":
                results["mobile_homepage_dom"] = get_dom_info(page)
            if page_key == "category_homme":
                results["mobile_category_dom"] = get_dom_info(page)
            page.close()
            ctx.close()

        # --- MOBILE MENU OPEN ---
        ctx = browser.new_context(
            viewport=VIEWPORTS["mobile"],
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        )
        page = ctx.new_page()
        capture_mobile_menu(page, PAGES["homepage"], f"{OUTPUT_DIR}/mobile_menu_open.png")
        results["mobile_menu_dom"] = page.evaluate("""() => {
            const allLinks = [...document.querySelectorAll('a[href]')];
            return {
                totalLinks: allLinks.length,
                menuLinks: allLinks.map(a => ({href: a.href, text: a.textContent.trim().slice(0,50), visible: a.offsetParent !== null})).slice(0, 40)
            };
        }""")
        page.close()
        ctx.close()

        # --- FULL PAGE SCROLLED (homepage mobile, lower fold) ---
        ctx = browser.new_context(
            viewport=VIEWPORTS["mobile"],
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        )
        page = ctx.new_page()
        page.goto(PAGES["homepage"], wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1000)
        page.screenshot(path=f"{OUTPUT_DIR}/homepage_mobile_bottom.png", full_page=False)
        print(f"Saved: {OUTPUT_DIR}/homepage_mobile_bottom.png")
        page.close()
        ctx.close()

        browser.close()

        # Print DOM analysis
        import json
        print("\n=== DOM ANALYSIS ===")
        print(json.dumps(results, indent=2, ensure_ascii=False))

        return results


if __name__ == "__main__":
    main()
