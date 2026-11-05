# Outils du diaporama Nice (V5, 5 novembre 2026)

Régénérer le PowerPoint sur le masque du colloque (une page par clic, notes incluses) :

1. Polices : `Sora[wght].ttf`, `Nunito[wght].ttf` dans `~/.fonts` (dépôt google/fonts, dossiers `ofl/sora` et `ofl/nunito`), puis `fc-cache -f`.
2. `node render_states.js ../nice-v3/index.html states 1816 921` : capture chaque état au clic (77 états), sans le bandeau de navigation, à la taille de la zone blanche du masque (1920×1080 moins 52 px de cadre).
3. `python3 build_pptx.py MASQUE.png NICE_SIGNAUX.pptx final` : compose chaque état sur le masque (collé en 52,52), construit le .pptx 16:9 (une image par page) et les notes de présentation (texte des `<aside class="notes">` du diaporama).
4. `soffice --headless --convert-to pdf NICE_SIGNAUX.pptx` : PDF de secours.

`mask_base_provisoire.png` : reconstruction partielle du masque (cadre vert d'eau #87CBBE, zone blanche) ; la bande du bas (logos) manque. Remplacer par le PNG original « MASQUE PPT_CIM-1920x1080 » du Drive dès qu'il est disponible dans la session.

`check.js` : vérifie chaque état au clic (débordements, fil de messages coupé) à 1920×1080, 1363×936, 1280×720, 1024×768. `shots.js` : captures d'écran de tous les états. `caps.js` : captures réelles de l'appli (diapo 8).
