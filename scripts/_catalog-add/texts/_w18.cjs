const fs=require('fs');
const T=[
["laverne-fearless",
"Un oriental floral de Laverne qui ouvre sur la mandarine et la bergamote, puis glisse vers le jasmin et le bois de santal avant de se poser sur le musc et l'ambre. Un flacon mixte de 200 ml en eau de parfum.",
`Fearless de Laverne s'adresse à ceux qui cherchent une eau de parfum mixte, à la fois lumineuse et enveloppante. Sa famille, oriental floral, se lit dès les premières minutes : rien de lourd, plutôt une chaleur douce qui s'installe progressivement. Le flacon de 200 ml permet de s'en servir généreusement au quotidien.

L'ouverture associe la mandarine et la bergamote. Ces deux agrumes donnent un départ vif et net, avec une fraîcheur juteuse qui réveille la peau sans l'agresser. Elle laisse vite place au cœur.

Au centre de la composition, le jasmin apporte sa facette florale et le bois de santal sa rondeur crémeuse. Les deux notes s'accordent bien : la fleur gagne en profondeur, le bois gagne en douceur. C'est dans cette phase que le parfum révèle son caractère le plus agréable.

Le fond repose sur le musc et l'ambre. Ils prolongent le sillage sur une base chaude et enveloppante, qui reste proche de la peau sans jamais devenir pesante.

Côté usage, Fearless se porte aussi bien au bureau qu'en soirée, et trouve naturellement sa place au printemps comme à l'automne, quand les températures modérées laissent les notes ambrées s'exprimer.

Chez Maison Numidia, ce parfum est 100 % original. La livraison est assurée par Yalidine dans les 69 wilayas, le paiement se fait à la livraison, et vous gardez le droit de refuser le colis si quelque chose ne vous convient pas.`],
["laverne-into-the-sea",
"Into The Sea de Laverne est un frais boisé masculin en eau de parfum, ouvert sur la mandarine, la bergamote et la fleur d'oranger. Le bois de santal et le vétiver d'Haïti en dessinent le fond, dans un flacon de 200 ml.",
`Into The Sea de Laverne est pensé pour l'homme qui veut une fragrance claire, facile à porter et sans excès. Son profil frais boisé en fait un parfum de journée, qu'on applique le matin et qu'on oublie volontiers, tant il reste discret et net.

La tête réunit la mandarine, la bergamote et la fleur d'oranger. Les deux agrumes donnent l'élan, un départ pétillant et propre, tandis que la fleur d'oranger arrondit l'ensemble et évite une fraîcheur trop sèche. La pyramide ne déclare pas de notes de cœur : on passe directement de cette ouverture lumineuse au fond, ce qui donne une trajectoire simple et lisible.

Le fond s'appuie sur le bois de santal et le vétiver d'Haïti. Le premier apporte une rondeur douce et crémeuse, le second une touche plus terreuse et verte qui structure le sillage. Ensemble, ils donnent au parfum une assise boisée élégante, sans lourdeur.

Dans la pratique, Into The Sea convient bien à la journée et au bureau. Il trouve sa place au printemps comme en été, quand on cherche une eau de parfum légère à la lecture mais bien présente grâce à ce grand format de 200 ml.

Maison Numidia le propose en version 100 % originale. Yalidine livre dans les 69 wilayas, le règlement s'effectue à la livraison, et le droit de refus à la livraison vous permet de commander l'esprit tranquille.`],
["laverne-king-tobacco",
"Un oriental fougère mixte signé Laverne : lavande et bergamote en tête, miel et tabac au cœur, vanille, fève tonka et musc au fond. Une eau de parfum de 200 ml, chaude et gourmande.",
`King Tobacco est une eau de parfum mixte de Laverne, construite autour d'une idée simple : mêler la fraîcheur d'une fougère à la chaleur d'un oriental. Le résultat s'adresse à celles et ceux qui aiment les parfums de caractère, avec de la présence et une touche gourmande.

L'ouverture met la lavande et la bergamote côte à côte. La lavande donne ce côté aromatique propre, presque barbier, et la bergamote ajoute un éclat d'agrume qui l'allège. C'est un début net, qui annonce la famille fougère sans détour.

Le cœur change de registre. Le miel et le tabac s'installent ensemble, l'un sucré et enrobant, l'autre sec et légèrement fumé. Cette association est le centre de gravité du parfum : elle lui donne son nom, son relief et son côté un peu rassurant.

Dans le fond, la vanille, la fève tonka et le musc ferment la composition sur une base douce et ronde. On reste dans un esprit gourmand et chaleureux, sans tomber dans le sucré lourd.

King Tobacco se porte au bureau comme en soirée, et se plaît particulièrement au printemps et à l'automne, quand on veut une fragrance de présence sans excès. Le flacon de 200 ml est généreux.

Chez Maison Numidia, le produit est 100 % original, livré par Yalidine dans les 69 wilayas, avec paiement à la livraison et droit de refus à la livraison.`],
["laverne-la-dor-bakhur-classic",
"La'dor Bakhur Classic, de Laverne, est un boisé oriental mixte en eau de parfum. Mandarine et encens à l'ouverture, iris, violette et patchouli au cœur, bois de gaïac au fond. Flacon de 200 ml.",
`La'dor Bakhur Classic de Laverne s'adresse à ceux qui apprécient les parfums à l'ambiance fumée et boisée, dans la tradition des fragrances orientales. Eau de parfum mixte en grand format de 200 ml, elle se destine surtout aux soirées et aux moments où l'on veut laisser une vraie signature.

Le départ associe la mandarine à l'encens. L'agrume apporte une première touche vive, presque juteuse, que l'encens vient aussitôt envelopper de sa fumée résineuse. Le contraste est franc et donne tout de suite le ton.

Le cœur rassemble l'iris, la violette et le patchouli. L'iris et la violette ajoutent une dimension poudrée et élégante, légèrement florale, tandis que le patchouli apporte sa terre et sa profondeur. C'est la partie la plus raffinée de la composition, celle où le parfum s'adoucit sans perdre de caractère.

Le fond repose sur le bois de gaïac, une note boisée fumée qui prolonge l'impression laissée par l'encens. Elle assure une conclusion cohérente avec l'ouverture et donne au sillage son allure sèche et sombre.

La'dor Bakhur Classic se porte surtout en automne et en hiver, en soirée ou pour les occasions spéciales, quand la fraîcheur du climat met en valeur les notes boisées.

Maison Numidia vous le propose 100 % original. Yalidine livre dans les 69 wilayas, vous payez à la livraison et vous conservez le droit de refus à la réception.`],
["laverne-sense",
"Sense de Laverne est un floral musqué féminin en eau de parfum de 75 ml. Cassis et mandarine à l'ouverture, fleur d'oranger, jasmin, bois de cachemire et iris au cœur, musc en fond.",
`Sense est une eau de parfum féminine de Laverne, au format pratique de 75 ml. Sa famille, floral musqué, la destine à celles qui aiment les parfums doux et soyeux, faciles à porter de la journée jusqu'à la soirée.

L'ouverture s'organise autour du cassis et de la mandarine. Le cassis donne un côté fruité légèrement acidulé, la mandarine un éclat plus solaire. Ensemble, ils créent un début gourmand et frais, sans être sucré à l'excès.

Le cœur est le plus riche de la pyramide. La fleur d'oranger et le jasmin forment un bouquet blanc et lumineux, que le bois de cachemire et l'iris viennent adoucir : le premier apporte une douceur boisée et veloutée, le second une nuance poudrée très élégante. L'ensemble se fond en un accord floral rond, soigné et assez enveloppant.

Le fond se résume au musc, une note propre et sensuelle qui reste près de la peau. C'est lui qui donne à Sense sa signature câline, discrète, que l'on perçoit surtout quand on s'approche.

Ce parfum se prête au bureau comme aux soirées, et se plaît au printemps comme à l'automne, saisons où les accords floraux se déploient sans lourdeur.

Chez Maison Numidia, Sense est 100 % original. La livraison par Yalidine couvre les 69 wilayas, le paiement s'effectue à la livraison, et le droit de refus à la livraison vous laisse libre de décider à la réception.`],
["laverne-tobacco",
"Tobacco de Laverne est une eau de parfum mixte de 100 ml, boisée et épicée. Cannelle, safran et noix de muscade en tête, patchouli et jasmin au cœur, ambre, tabac, bois de santal et musc blanc au fond.",
`Tobacco de Laverne est un parfum mixte pour les amateurs de compositions chaudes et épicées. Sa famille, boisé épicé, se devine dès la première seconde : on est dans l'univers des soirées fraîches, des vêtements épais et des parfums qui laissent une trace.

La tête réunit trois épices : la cannelle, le safran et la noix de muscade. La cannelle donne un côté doux et brûlant, le safran une note cuirée et dorée, la noix de muscade une chaleur sèche. Cet accord ouvre le parfum avec beaucoup de présence et pose l'ambiance tout de suite.

Au cœur, le patchouli et le jasmin changent le décor. Le patchouli apporte de la profondeur terreuse, le jasmin une rondeur florale qui évite que l'ensemble ne devienne trop sévère. C'est une transition bien menée, qui adoucit sans diluer.

Le fond rassemble l'ambre, le tabac, le bois de santal et le musc blanc. Le tabac en est la note signature, entourée d'une chaleur ambrée et d'une douceur boisée, avec le musc blanc pour lisser le tout. Le sillage reste profond et enveloppant.

Tobacco se destine aux soirées et aux occasions spéciales, surtout en automne et en hiver. Il est proposé en 100 ml.

Maison Numidia garantit un parfum 100 % original, livré par Yalidine dans les 69 wilayas, avec paiement à la livraison et droit de refus à la livraison.`]
];
const bad=/COD|WhatsApp|58 wilayas|2025|---|certificat|scell|dédouan/i;
const dir=__dirname;
for(const [slug,s,d] of T){
 const wc=x=>x.trim().split(/\s+/).length;
 console.log(slug,wc(s),wc(d),bad.test(s+d)?'BAD':'ok');
 const f=dir+'/'+slug+'.json';
 fs.writeFileSync(f,JSON.stringify({slug,shortDescription:s,description:d,ecritLe:"2026-11-21"},null,1));
 JSON.parse(fs.readFileSync(f,'utf8'));
}
