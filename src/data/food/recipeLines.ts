export const RECIPE_LINES = `
sushi rice:150 riceVinegar:18 sugar:6 salt:2 fish:70 nori:5 | boil rice | drain rice | mix riceVinegar sugar salt | fold rice riceVinegar | assemble nori rice fish
ramen noodle:100 stockBeef:400 porkBelly:60 egg:50 scallion:15 soy:15 | simmer:90 porkBelly stockBeef | boil noodle | boil egg | assemble noodle stockBeef porkBelly egg scallion soy
pizza flour:110 water:70 yeast:2 salt:3 oliveOil:10 tomato:80 mozzarella:90 basil:5 | knead flour water yeast salt oliveOil | rise:60 flour water yeast salt oliveOil | mix tomato salt | assemble flour tomato mozzarella | bake:12 | finish basil
risotto rice:80 onion:40 butter:20 stock:350 parmesan:30 wine:40 | fry onion butter | fry rice | simmer:18 rice stock wine | finish butter parmesan
taco tortilla:40 beef:80 onion:30 cilantro:10 salsa:40 lime:15 chili:6 salt:2 | fry beef onion | season beef chili salt | warm tortilla | assemble tortilla beef salsa cilantro lime
guacamole avocado:150 lime:20 onion:20 cilantro:10 chili:5 salt:2 | mash avocado | mix avocado lime onion cilantro chili salt
paella rice:80 stock:250 saffron:0.2 shrimp:60 mussel:50 bellPepper:40 tomato:40 oliveOil:15 garlic:5 | fry bellPepper garlic oliveOil | mix tomato saffron | simmer:18 rice stock shrimp mussel bellPepper tomato
pad-thai riceNoodle:100 shrimp:60 egg:50 tamarind:20 fishSauce:15 sugar:10 peanut:20 bean:30 lime:15 | soak:20 riceNoodle | fry shrimp egg | toss riceNoodle shrimp tamarind fishSauce sugar bean | serve peanut lime
tom-yum shrimp:80 stock:350 lemongrass:15 galangal:10 kaffir:4 chili:8 lime:20 fishSauce:15 mushroom:40 | simmer:10 stock lemongrass galangal kaffir chili | simmer:5 shrimp mushroom | finish fishSauce lime
croissant flour:120 butter:80 water:60 yeast:4 salt:3 sugar:8 milk:30 | knead flour water yeast salt sugar milk | fold flour butter | rise:60 flour | shape flour butter | bake:16
burger beef:120 bun:70 cheddar:20 onion:20 tomato:30 lettuce:20 ketchup:15 | shape beef | sear beef | toast bun | assemble bun beef cheddar onion tomato lettuce ketchup
pho riceNoodle:100 stockBeef:400 beef:60 onion:30 ginger:10 spice:2 fishSauce:10 herb:15 lime:15 bean:20 | simmer:60 stockBeef onion ginger spice | boil riceNoodle | assemble riceNoodle stockBeef beef herb lime bean fishSauce
bibimbap rice:150 beef:60 spinach:40 carrot:40 bean:40 egg:50 gochujang:20 sesameOil:8 | fry beef | fry spinach carrot bean | fry egg | assemble rice beef spinach carrot bean egg gochujang sesameOil
kimchi napa:300 salt:15 chili:20 garlic:15 ginger:10 fishSauce:15 scallion:30 | season napa salt | mix chili garlic ginger fishSauce scallion | pickle napa chili garlic ginger
duck duck:250 flour:40 water:30 scallion:20 hoisin:25 cucumber:30 | roast duck | knead flour water | shape flour | steam flour | assemble duck flour hoisin cucumber scallion
fish-chips fish:180 flour:60 water:80 potato:200 salt:4 oil:30 | mix flour water salt | batter fish flour | deep fish | fry potato oil | season potato salt
moussaka eggplant:200 beef:150 onion:60 tomato:80 cinnamon:1 butter:20 flour:15 milk:200 parmesan:20 egg:50 | fry eggplant | fry beef onion tomato cinnamon | whisk butter flour milk | layer eggplant beef milk parmesan egg | bake:40
doner lamb:150 pita:80 onion:30 tomato:40 yogurt:30 chili:5 | grill lamb | toast pita | assemble pita lamb onion tomato yogurt chili
baklava phyllo:80 butter:60 walnut:70 pistachio:30 sugar:80 water:40 lemon:15 | syrup sugar water lemon | layer phyllo walnut pistachio | glaze phyllo butter | bake:35 | finish sugar
poutine potato:200 curd:80 gravy:100 salt:3 oil:20 | fry potato oil | season potato salt | warm gravy | assemble potato curd gravy
feijoada blackBean:150 pork:80 sausage:60 onion:50 garlic:8 bay:1 orange:30 | soak:480 blackBean | simmer:90 blackBean pork sausage onion garlic bay | serve orange
butter-chicken chicken:180 yogurt:40 tomato:120 butter:30 cream:60 garam:4 garlic:8 ginger:8 | marinate:30 chicken yogurt garam | fry chicken | simmer:20 chicken tomato garlic ginger butter | finish cream
dosa rice:80 lentil:30 water:120 salt:3 oil:10 | soak:240 rice lentil | blend rice lentil salt water | ferment rice | fry rice oil
borscht beef:80 beet:120 cabbage:80 potato:80 carrot:40 onion:50 tomato:40 stockBeef:280 garlic:6 sourCream:25 | sear beef | fry onion carrot | simmer:40 beef beet cabbage potato tomato stockBeef | finish garlic | serve sourCream
varenyky flour:90 water:45 egg:20 salt:3 potato:150 onion:40 butter:20 | boil potato | mash potato | fry onion butter | mix potato onion salt | knead flour water egg salt | wrap flour water egg > potato onion | poach
goulash beef:180 onion:120 paprika:12 oil:20 tomato:40 stockBeef:200 potato:100 caraway:1 | fry onion oil | sear beef | simmer:80 beef onion paprika tomato stockBeef potato caraway
ceviche fish:160 lime:50 onion:40 chili:8 cilantro:10 salt:3 | mix fish lime onion chili cilantro salt | cure:15 fish lime
tagine lamb:180 onion:70 driedLime:8 apricotJam:30 spice:4 oil:20 chickpea:60 cilantro:10 stock:150 | fry onion oil | slow:90 lamb onion chickpea spice stock | finish apricotJam driedLime cilantro
couscous semolina:80 water:80 salt:2 carrot:40 zucchini:40 chickpea:40 onion:30 oil:15 spice:3 | fry onion carrot zucchini oil | simmer:20 carrot zucchini chickpea onion spice | steam semolina water salt | serve semolina
pierogi flour:90 water:45 egg:20 salt:3 potato:120 quark:40 onion:30 butter:15 | mash potato | fry onion butter | mix potato quark onion salt | knead flour water egg salt | wrap flour water egg > potato quark | poach
fondue gruyere:80 emmental:60 wine:80 garlic:4 bread:80 starch:5 | warm wine garlic | melt gruyere emmental | mix starch | serve bread
pretzel flour:150 water:80 yeast:4 salt:6 malt:8 lye:20 bakingSoda:10 | knead flour water yeast salt malt | rise:40 flour | shape flour | boil flour lye bakingSoda | bake:14 | finish salt
currywurst sausage:100 ketchup:40 curryPaste:8 paprika:3 | fry sausage | mix ketchup curryPaste paprika | assemble sausage ketchup
khachapuri flour:120 water:70 yeast:3 salt:3 cheese:100 egg:50 butter:15 | knead flour water yeast salt | rise:40 flour | shape flour cheese | bake:15 | finish egg butter
plov rice:90 lamb:120 carrot:100 onion:80 oil:40 water:160 cumin:2 salt:4 garlic:15 | fry onion oil | sear lamb | fry carrot | season salt cumin | simmer:40 lamb onion carrot water | simmer:25 rice garlic lamb | rest:15
falafel chickpea:120 onion:30 parsley:15 cilantro:10 garlic:6 cumin:2 salt:3 oil:20 | soak:480 chickpea | blend chickpea onion parsley cilantro garlic cumin salt | shape chickpea | deep chickpea oil
jollof rice:90 tomato:120 onion:50 bellPepper:40 stockChicken:200 oil:20 thyme:1 | fry onion bellPepper oil | blend tomato onion | simmer:25 rice tomato stockChicken thyme
pelmeni flour:90 water:40 egg:20 salt:3 beef:50 pork:40 onion:30 blackPepper:1 butter:15 | knead flour water egg salt | mix beef pork onion blackPepper salt | wrap flour water egg > beef pork onion | poach | serve butter
meatballs beef:80 pork:40 onion:20 egg:20 breadcrumb:15 cream:80 stockBeef:100 lingonberry:30 butter:15 | mix beef pork onion egg breadcrumb | shape beef | fry beef butter | simmer:15 beef cream stockBeef | serve lingonberry
schnitzel veal:160 flour:20 egg:50 breadcrumb:40 oil:30 lemon:20 | crisp veal flour egg breadcrumb oil | serve lemon
injera teff:80 water:160 salt:1 lentil:40 onion:30 berbere:6 oil:15 | ferment teff water | fry teff | simmer:25 lentil onion berbere oil | serve teff
empanada flour:100 lard:30 water:40 salt:3 beef:80 onion:40 egg:30 olive:15 cumin:2 paprika:2 | knead flour lard water salt | fry beef onion cumin paprika | mix beef egg olive | wrap flour > beef onion | bake:25
lasagna pasta:80 beef:100 onion:40 carrot:30 celery:20 tomato:120 butter:20 flour:15 milk:200 parmesan:30 | fry beef onion carrot celery | simmer:20 beef tomato | whisk butter flour milk | layer pasta beef milk parmesan | bake:35
carbonara pasta:100 guanciale:50 yolk:40 pecorino:30 blackPepper:1 | boil pasta | drain pasta | dry guanciale | whisk yolk pecorino blackPepper | toss pasta guanciale yolk pecorino
tiramisu mascarpone:120 yolk:40 white:50 sugar:30 coffee:60 ladyfinger:40 cocoa:5 | whisk yolk sugar | fold mascarpone | whip white | layer ladyfinger coffee mascarpone cocoa | chill:120 mascarpone
gelato milk:200 cream:80 sugar:50 yolk:40 fruitMix:40 | custard milk cream sugar yolk | fold fruitMix | chill:180 milk fruitMix
bruschetta bread:80 tomato:80 basil:6 garlic:4 oliveOil:15 salt:2 | toast bread | mix tomato basil garlic oliveOil salt | assemble bread tomato
gnocchi potato:200 flour:50 egg:40 salt:3 parmesan:20 butter:15 | boil potato | mash potato | mix potato flour egg salt | shape potato | boil potato | serve butter parmesan
ravioli flour:80 egg:40 salt:2 ricotta:80 spinach:40 parmesan:20 | knead flour egg salt | fry spinach | mix ricotta spinach parmesan | wrap flour egg > ricotta spinach | poach
pesto basil:40 pineNut:20 parmesan:25 garlic:4 oliveOil:40 salt:2 pasta:90 | blend basil pineNut parmesan garlic oliveOil salt | boil pasta | toss pasta basil
focaccia flour:150 water:110 yeast:3 salt:5 oliveOil:25 rosemary:3 | knead flour water yeast salt oliveOil | rise:60 flour | shape flour | glaze oliveOil rosemary | bake:20
ossobuco veal:220 onion:40 carrot:40 celery:30 tomato:60 stock:150 wine:50 butter:15 gremolata:10 | sear veal | fry onion carrot celery | slow:90 veal tomato stock wine | finish gremolata
caprese mozzarella:100 tomato:100 basil:8 oliveOil:15 salt:2 | season tomato mozzarella salt | assemble tomato mozzarella basil oliveOil
arancini rice:100 stock:250 saffron:0.2 mozzarella:40 beef:30 breadcrumb:30 egg:40 oil:20 | simmer:18 rice stock saffron | chill:30 rice | wrap rice > mozzarella beef | crisp rice breadcrumb egg oil
panettone flour:150 yeast:6 egg:60 butter:50 sugar:40 raisin:40 candied:30 milk:40 | knead flour yeast egg butter sugar milk | fold raisin candied | rise:90 flour | bake:35
minestrone onion:40 carrot:40 celery:30 zucchini:40 bean:40 tomato:80 stock:300 pasta:30 oliveOil:15 | fry onion carrot celery oliveOil | simmer:25 onion carrot celery zucchini bean tomato stock | boil pasta | finish pasta
polenta polenta:80 water:320 salt:3 butter:20 parmesan:20 | simmer:30 polenta water salt | finish butter parmesan
tempura shrimp:80 flour:40 starch:20 egg:30 water:80 oil:30 | whisk flour starch egg water | batter shrimp flour | deep shrimp oil
udon noodle:120 dashi:350 soy:15 mirin:10 scallion:15 | boil noodle | warm dashi soy mirin | assemble noodle dashi scallion
soba noodle:100 dashi:250 soy:15 mirin:10 scallion:10 | boil noodle | drain noodle | mix dashi soy mirin | assemble noodle dashi scallion
yakitori chicken:150 soy:20 mirin:15 sugar:8 scallion:20 | mix soy mirin sugar | grill chicken | glaze chicken soy | serve scallion
miso-soup dashi:300 miso:20 tofu:60 seaweed:5 scallion:10 | warm dashi | dissolve miso | finish tofu seaweed scallion
okonomiyaki flour:60 egg:50 cabbage:120 dashi:40 porkBelly:40 ketchup:15 mayonnaise:10 | mix flour egg cabbage dashi | fry cabbage porkBelly | glaze ketchup mayonnaise
takoyaki flour:40 egg:40 dashi:80 octopus:40 scallion:15 oil:15 | mix flour egg dashi | fry flour octopus scallion oil | shape flour
tonkatsu pork:160 flour:15 egg:40 breadcrumb:40 oil:30 cabbage:40 | crisp pork flour egg breadcrumb oil | serve cabbage
onigiri rice:150 salt:2 nori:4 tuna:30 | mix rice salt tuna | shape rice | assemble rice nori
mochi rice:100 water:80 sugar:20 bean:40 | soak:60 rice | steam rice | pound rice | shape rice bean
sashimi fish:120 soy:15 | chill:10 fish | assemble fish soy
gyoza wrapper:40 pork:60 cabbage:40 garlic:5 soy:8 sesameOil:6 oil:10 | mix pork cabbage garlic soy sesameOil | wrap wrapper > pork cabbage | fry wrapper oil | steam wrapper
donburi rice:150 chicken:80 egg:50 onion:40 soy:15 mirin:10 dashi:40 | simmer:10 chicken onion soy mirin dashi | finish egg | assemble rice chicken egg
natto bean:80 soy:8 scallion:10 mustard:3 rice:120 | mix bean soy scallion mustard | serve rice
burrito tortilla:70 rice:60 blackBean:50 beef:60 cheese:30 salsa:30 | fry beef | warm tortilla | assemble tortilla rice blackBean beef cheese salsa
enchilada tortilla:50 chicken:80 tomato:60 chili:8 onion:30 cheese:40 stockChicken:40 | fry onion chili | simmer:10 chicken tomato stockChicken | wrap tortilla > chicken | bake:15 cheese
quesadilla tortilla:50 cheese:60 chicken:40 | assemble tortilla cheese chicken | fry tortilla
mole chicken:150 moleChili:20 chocolateBar:15 onion:30 garlic:6 spiceMole:4 stockChicken:200 sesame:10 | fry onion garlic moleChili | blend onion garlic moleChili chocolateBar spiceMole sesame stockChicken | simmer:30 chicken stockChicken
elote corn:150 mayonnaise:25 cheese:15 chili:4 lime:10 | grill corn | glaze corn mayonnaise cheese chili lime
pozole hominy:120 pork:100 onion:40 garlic:6 chili:8 stock:400 cabbage:30 radish:20 lime:15 | simmer:80 pork hominy onion garlic chili stock | serve cabbage radish lime
tamale masa:100 lard:30 stock:60 pork:60 chili:8 onion:20 leaf:10 | fry pork onion chili | mix masa lard stock | wrap leaf masa > pork | steam masa
chilaquiles chip:60 tomato:80 chili:8 onion:20 egg:50 oil:10 cilantro:8 | fry onion chili oil | blend tomato onion chili | warm chip tomato | fry egg | serve cilantro
carnitas pork:200 orange:40 onion:40 garlic:8 lard:20 salt:4 | slow:120 pork orange onion garlic lard salt | rest:10 pork
gazpacho tomato:200 cucumber:50 bellPepper:40 onion:30 garlic:5 oliveOil:20 vinegar:10 salt:3 bread:20 | blend tomato cucumber bellPepper onion garlic oliveOil vinegar salt bread | chill:60 tomato
tortilla-espanola potato:200 egg:100 onion:60 oliveOil:30 salt:3 | fry potato onion oliveOil | whisk egg salt | fry potato egg
patatas-bravas potato:200 oliveOil:25 tomato:60 paprika:6 garlic:5 | fry potato oliveOil | fry tomato paprika garlic | assemble potato tomato
jamon ham:80 bread:40 tomato:30 oliveOil:8 | toast bread | assemble ham bread tomato oliveOil
fabada whiteBean:150 sausage:60 pork:50 onion:40 paprika:4 garlic:6 | soak:480 whiteBean | simmer:90 whiteBean sausage pork onion paprika garlic
crema-catalana milk:200 yolk:40 sugar:40 starch:12 lemonZest:3 cinnamon:1 | custard milk yolk sugar starch lemonZest cinnamon | caramel:3 sugar
pulpo octopus:200 potato:150 paprika:6 oliveOil:15 salt:4 | boil octopus | boil potato | assemble octopus potato paprika oliveOil salt
cocido chickpea:100 beef:80 chicken:60 cabbage:60 carrot:40 potato:80 onion:40 | soak:480 chickpea | simmer:90 chickpea beef chicken cabbage carrot potato onion
green-curry chicken:150 coconutMilk:200 curryPaste:25 eggplant:60 basil:8 fishSauce:12 | fry curryPaste | simmer:15 chicken coconutMilk eggplant | finish fishSauce basil
tom-kha chicken:120 coconutMilk:250 galangal:12 lemongrass:15 kaffir:4 lime:20 fishSauce:12 mushroom:40 | simmer:12 coconutMilk galangal lemongrass kaffir | simmer:8 chicken mushroom | finish lime fishSauce
mango-rice stickyRice:80 coconutMilk:80 palmSugar:20 salt:2 mango:120 | steam stickyRice | warm coconutMilk palmSugar salt | mix stickyRice coconutMilk | serve mango
som-tam papaya:150 chili:8 garlic:6 lime:20 fishSauce:15 palmSugar:12 peanut:15 tomato:40 | pound chili garlic | mix papaya lime fishSauce palmSugar peanut tomato
massaman beef:150 potato:100 coconutMilk:200 curryPaste:25 peanut:20 onion:40 | fry curryPaste | slow:60 beef potato coconutMilk onion peanut
khao-pad rice:150 egg:50 garlic:6 fishSauce:12 soy:8 scallion:15 oil:15 | fry garlic egg oil | fry rice | season rice fishSauce soy | finish scallion
ratatouille eggplant:80 zucchini:80 bellPepper:60 tomato:120 onion:40 garlic:6 oliveOil:20 thyme:2 | fry onion garlic oliveOil | simmer:30 eggplant zucchini bellPepper tomato thyme
crepe flour:60 egg:50 milk:150 butter:20 sugar:10 | whisk flour egg milk butter sugar | fry flour
quiche flour:80 butter:40 water:25 egg:80 cream:100 bacon:40 cheese:30 | knead flour butter water | fry bacon | whisk egg cream cheese | assemble flour bacon egg | bake:30
bouillabaisse fish:150 stockFish:300 tomato:80 onion:40 garlic:6 saffron:0.2 celery:20 oliveOil:15 | fry onion garlic celery oliveOil | simmer:20 fish tomato stockFish saffron
coq-au-vin chicken:180 redWine:200 bacon:40 mushroom:50 onion:60 stockChicken:100 butter:15 | fry bacon onion | sear chicken | slow:50 chicken redWine mushroom stockChicken
cassoulet whiteBean:150 duck:80 sausage:60 pork:40 tomato:50 breadcrumb:20 | soak:480 whiteBean | simmer:60 whiteBean duck sausage pork tomato | bake:30 breadcrumb
nicoise tuna:80 egg:50 potato:80 greenBean:50 tomato:60 olive:20 oliveOil:15 | boil egg | boil potato | boil greenBean | assemble tuna egg potato greenBean tomato olive oliveOil
creme-brulee cream:200 yolk:40 sugar:40 vanilla:3 | custard cream yolk sugar vanilla | chill:120 cream | caramel:3 sugar
baguette flour:200 water:130 yeast:3 salt:4 | knead flour water yeast salt | rise:60 flour | shape flour | bake:22
souffle white:70 yolk:20 butter:20 flour:15 milk:120 sugar:20 | whisk butter flour milk yolk | whip white | fold white sugar | bake:18
escargot snail:80 butter:40 garlic:8 parsley:8 | mix butter garlic parsley | bake:10 snail butter
onion-soup onion:200 butter:20 stockBeef:300 bread:30 gruyere:40 thyme:1 | fry onion butter | simmer:20 onion stockBeef thyme | toast bread | melt gruyere | assemble onion bread gruyere
macaron almond:60 white:50 sugar:50 butter:30 | whip white sugar | fold almond | shape almond | bake:14 | assemble almond butter
tarte-tatin apple:180 sugar:60 butter:40 flour:80 | caramel:4 sugar | fry apple butter | knead flour butter | bake:25 apple flour
hot-dog sausage:80 bun:60 ketchup:15 mustard:10 | grill sausage | toast bun | assemble bun sausage ketchup mustard
apple-pie apple:200 sugar:40 cinnamon:3 flour:120 butter:60 water:30 | knead flour butter water | mix apple sugar cinnamon | wrap flour > apple | bake:40
clam-chowder clam:100 potato:120 onion:40 celery:30 bacon:30 cream:80 butter:20 flour:15 milk:100 | fry bacon onion celery butter | mix flour | simmer:20 clam potato milk cream
ribs pork:250 bbq:50 paprika:4 salt:4 | season pork paprika salt | roast pork | glaze pork bbq
mac-cheese pasta:90 cheddar:60 butter:20 flour:15 milk:200 | boil pasta | whisk butter flour milk | melt cheddar | mix pasta cheddar
pancake flour:80 egg:40 milk:120 bakingPowder:4 butter:20 maple:30 | whisk flour egg milk bakingPowder | fry flour butter | serve maple
bagel flour:150 water:80 yeast:4 salt:4 malt:10 | knead flour water yeast salt malt | rise:40 flour | shape flour | boil flour | bake:18
buffalo-wings chicken:200 hotSauce:30 butter:20 | roast chicken | melt butter hotSauce | toss chicken butter hotSauce
gumbo okra:60 flour:20 oil:20 sausage:50 shrimp:50 bellPepper:40 celery:30 onion:40 stock:300 | fry flour oil | fry onion celery bellPepper | simmer:30 okra sausage shrimp stock
cornbread cornmeal:100 flour:40 egg:40 milk:120 butter:30 bakingPowder:4 sugar:15 | mix cornmeal flour egg milk butter bakingPowder sugar | bake:22
lobster-roll lobster:100 mayonnaise:25 bun:50 lemon:10 celery:15 | mix lobster mayonnaise celery lemon | toast bun | assemble bun lobster
cobb-salad chicken:80 bacon:30 egg:50 avocado:50 tomato:40 lettuce:40 blueCheese:20 oliveOil:15 | grill chicken | fry bacon | boil egg | assemble lettuce chicken bacon egg avocado tomato blueCheese oliveOil
banh-mi bread:80 pork:60 pickledCarrot:30 cucumber:20 cilantro:8 mayonnaise:15 chili:4 | grill pork | assemble bread pork pickledCarrot cucumber cilantro mayonnaise chili
bun-cha riceNoodle:80 pork:80 herb:15 fishSauce:15 lime:15 sugar:8 garlic:5 | grill pork | mix fishSauce lime sugar garlic | assemble riceNoodle pork herb fishSauce
spring-roll ricePaper:20 vermicelli:30 shrimp:40 lettuce:20 herb:10 | soak:2 ricePaper | boil vermicelli | wrap ricePaper > vermicelli shrimp lettuce herb
com-tam brokenRice:120 pork:80 egg:50 scallion:15 fishSauce:15 | grill pork | fry egg scallion | assemble brokenRice pork egg fishSauce
cao-lau noodle:90 pork:70 greens:40 cracker:15 herb:10 | boil noodle | grill pork | assemble noodle pork greens cracker herb
bulgogi beef:150 soy:20 sugar:15 pear:30 garlic:8 sesameOil:8 scallion:20 | blend pear garlic | marinate:30 beef soy sugar pear sesameOil | fry beef | serve scallion
kimchi-jjigae kimchi:150 pork:60 tofu:80 gochujang:15 stock:200 scallion:15 | fry kimchi pork | simmer:20 kimchi pork tofu gochujang stock | finish scallion
japchae glassNoodle:80 beef:50 spinach:40 carrot:30 mushroom:30 soy:15 sesameOil:8 | boil glassNoodle | fry beef spinach carrot mushroom | toss glassNoodle soy sesameOil
tteokbokki riceCake:120 gochujang:25 fishCake:40 stock:150 sugar:10 scallion:15 | simmer:12 riceCake gochujang fishCake stock sugar | finish scallion
samgyeopsal porkBelly:180 lettuce:40 garlic:8 sesameOil:8 kimchi:40 | grill porkBelly | assemble lettuce porkBelly garlic sesameOil kimchi
kimbap rice:120 sesameOil:6 salt:2 nori:6 egg:40 spinach:30 carrot:30 | mix rice sesameOil salt | fry egg spinach carrot | wrap nori rice > egg spinach carrot
dumpling wrapper:40 pork:60 cabbage:40 scallion:15 soy:8 ginger:5 | mix pork cabbage scallion soy ginger | wrap wrapper > pork cabbage | poach
mapo-tofu tofu:200 beef:40 doubanjiang:20 garlic:6 ginger:5 scallion:15 stock:80 sichuanPepper:2 | fry beef doubanjiang garlic ginger | simmer:8 tofu stock | finish scallion sichuanPepper
kung-pao chicken:150 peanut:30 driedChili:8 scallion:20 soy:15 vinegar:8 sugar:8 | fry driedChili peanut | fry chicken scallion | toss chicken soy vinegar sugar
fried-rice rice:150 egg:50 scallion:20 carrot:30 soy:12 oil:15 | fry egg oil | fry rice carrot | season rice soy | finish scallion
xiaolongbao wrapper:40 pork:50 aspic:30 scallion:10 ginger:5 soy:8 | mix pork aspic scallion ginger soy | wrap wrapper > pork aspic | steam wrapper
hot-pot stock:400 beef:80 cabbage:80 tofu:60 mushroom:40 noodle:60 | simmer:10 stock | boil beef cabbage tofu mushroom noodle
wonton wrapper:30 pork:40 shrimp:20 scallion:10 stock:300 | mix pork shrimp scallion | wrap wrapper > pork shrimp | simmer:4 wrapper stock
chow-mein noodle:120 cabbage:60 carrot:40 soy:15 oil:15 scallion:15 | boil noodle | fry cabbage carrot oil | toss noodle soy scallion
congee rice:40 water:400 ginger:8 scallion:10 salt:2 | simmer:40 rice water ginger | finish scallion salt
char-siu pork:200 honey:20 soy:25 hoisin:15 fiveSpice:2 garlic:6 | marinate:60 pork honey soy hoisin fiveSpice garlic | roast pork | glaze pork honey
sunday-roast beef:180 potato:200 carrot:60 onion:40 stockBeef:100 flour:10 | roast beef potato carrot onion | mix flour stockBeef | serve stockBeef
shepherds-pie beef:150 onion:50 carrot:40 pea:40 potato:200 butter:20 milk:40 | fry beef onion carrot | simmer:15 beef pea | mash potato butter milk | layer potato beef | bake:25
full-breakfast egg:50 bacon:40 sausage:60 bean:50 tomato:40 mushroom:30 bread:40 | fry bacon sausage | fry egg tomato mushroom | warm bean | toast bread
yorkshire flour:50 egg:50 milk:80 salt:2 | whisk flour egg milk salt | bake:15
bangers-mash sausage:100 potato:200 butter:20 milk:30 onion:40 gravy:60 | fry sausage onion | mash potato butter milk | serve gravy
sticky-toffee date:60 butter:40 sugar:40 cream:40 flour:50 egg:40 | mix date butter sugar cream | mix flour egg | bake:25 | warm butter sugar cream
scotch-egg egg:60 sausage:80 breadcrumb:30 flour:10 oil:20 | boil egg | wrap sausage > egg | crisp sausage breadcrumb flour oil
haggis offal:120 oat:40 onion:40 suet:30 spice:3 stock:40 | fry onion | mix offal oat onion suet spice stock | simmer:60 offal
pasty flour:100 butter:40 water:30 beef:70 potato:60 turnip:40 onion:30 salt:3 | knead flour butter water | mix beef potato turnip onion salt | wrap flour > beef potato | bake:40
souvlaki pork:140 pita:70 tomato:40 onion:30 oliveOil:10 herb:2 | grill pork | assemble pita pork tomato onion oliveOil
greek-salad tomato:100 cucumber:80 feta:60 olive:30 onion:20 oliveOil:15 herb:2 | season tomato cucumber herb | assemble tomato cucumber feta olive onion oliveOil
tzatziki yogurt:150 cucumber:80 garlic:6 dill:5 oliveOil:10 salt:2 | mix yogurt cucumber garlic dill oliveOil salt | chill:15 yogurt
spanakopita phyllo:70 spinach:150 feta:60 onion:40 egg:40 oliveOil:20 dill:5 | fry onion spinach | mix spinach feta egg dill | layer phyllo spinach | glaze oliveOil | bake:30
gyros pork:140 pita:70 tomato:40 onion:30 yogurt:30 | grill pork | assemble pita pork tomato onion yogurt
dolma grapeLeaf:30 rice:60 onion:40 herb:10 oliveOil:20 lemon:15 | fry onion rice oliveOil | mix rice herb | wrap grapeLeaf > rice | simmer:30 grapeLeaf lemon
avgolemono stockChicken:300 rice:40 egg:50 lemon:30 | boil rice stockChicken | whisk egg lemon | finish egg lemon
kebab lamb:140 bread:70 onion:40 tomato:40 yogurt:25 | grill lamb | assemble bread lamb onion tomato yogurt
lahmacun flour:80 water:50 yeast:2 salt:2 beef:60 onion:30 tomato:40 parsley:10 | knead flour water yeast salt | rise:30 flour | mix beef onion tomato parsley | assemble flour beef | bake:10
menemen egg:80 tomato:80 bellPepper:40 onion:30 oliveOil:15 | fry onion bellPepper oliveOil | simmer:8 tomato | finish egg
borek phyllo:70 cheese:80 parsley:10 egg:40 butter:30 | mix cheese parsley egg | layer phyllo cheese | glaze butter | bake:25
lokum starch:40 sugar:150 water:80 roseWater:8 lemon:10 | syrup sugar water | dissolve starch | mix starch sugar lemon | finish roseWater | chill:60 starch
pide flour:100 water:60 yeast:3 salt:3 beef:60 cheese:40 onion:20 | knead flour water yeast salt | rise:30 flour | shape flour beef cheese onion | bake:14
manti wrapper:40 beef:40 onion:20 yogurt:60 garlic:5 butter:15 paprika:3 | mix beef onion | wrap wrapper > beef onion | poach | serve yogurt garlic butter paprika
butter-tart flour:70 butter:35 water:20 sugar:40 egg:30 maple:20 raisin:15 | knead flour butter water | mix sugar egg maple raisin | wrap flour > sugar | bake:18
nanaimo biscuit:40 butter:30 coconut:15 cocoa:10 custardPowder:15 milk:40 chocolate:40 | mix biscuit butter coconut cocoa | custard custardPowder milk butter | melt chocolate | layer biscuit milk chocolate | chill:60 chocolate
tourtiere flour:100 butter:40 water:30 pork:80 onion:40 spice:3 potato:40 | knead flour butter water | fry pork onion spice potato | wrap flour > pork | bake:35
pea-soup pea:120 pork:40 onion:40 carrot:30 stock:400 | soak:480 pea | simmer:70 pea pork onion carrot stock
moqueca fish:160 coconutMilk:200 palmOil:20 onion:40 tomato:80 bellPepper:40 cilantro:10 lime:15 | fry onion bellPepper | simmer:12 fish coconutMilk tomato palmOil | finish cilantro lime
pao-de-queijo tapioca:80 cheese:60 egg:40 milk:40 oil:20 salt:2 | warm milk oil | mix tapioca cheese egg salt | shape tapioca | bake:18
acai acai:100 banana:60 granola:30 fruit:40 | blend acai banana | assemble acai granola fruit
coxinha flour:40 butter:15 milk:80 chicken:70 creamCheese:20 breadcrumb:30 egg:30 oil:20 | simmer:10 flour butter milk | mix chicken creamCheese | wrap flour > chicken | crisp flour breadcrumb egg oil
brigadeiro condensedMilk:150 cocoa:20 butter:15 chocolate:20 | warm condensedMilk cocoa butter | chill:30 condensedMilk | shape condensedMilk chocolate
churrasco beef:200 salt:6 | season beef salt | grill beef
biryani rice:90 lamb:120 yogurt:40 onion:50 saffron:0.2 garam:4 ghee:20 stock:150 | fry onion ghee | marinate:20 lamb yogurt garam | simmer:20 lamb stock | boil rice saffron | layer rice lamb | rest:15
samosa flour:80 oil:15 water:30 potato:100 pea:30 cumin:2 garam:2 chili:4 | knead flour oil water | boil potato | mash potato | mix potato pea cumin garam chili | wrap flour > potato | deep flour
naan flour:100 yogurt:40 yeast:3 salt:2 ghee:15 | knead flour yogurt yeast salt | rise:40 flour | shape flour | grill flour | glaze ghee
tandoori chicken:180 yogurt:50 tandoorSpice:8 lemon:15 garlic:8 ginger:8 | marinate:60 chicken yogurt tandoorSpice lemon garlic ginger | roast chicken
palak-paneer spinach:200 paneer:80 onion:30 garlic:6 ginger:6 cream:30 ghee:15 garam:3 | fry onion garlic ginger ghee | blend spinach | simmer:8 spinach paneer cream garam
idli rice:60 lentil:20 salt:2 | soak:240 rice lentil | blend rice lentil salt | ferment rice | steam rice
vindaloo pork:160 vinegar:25 chili:10 garlic:8 ginger:8 spice:4 onion:40 | blend vinegar chili garlic ginger spice | marinate:60 pork vinegar | slow:40 pork onion
dal lentil:80 onion:30 tomato:40 turmeric:2 cumin:2 garlic:5 ghee:15 water:300 | fry onion garlic cumin ghee | simmer:25 lentil tomato turmeric water
gulab-jamun milkPowder:40 flour:10 ghee:10 milk:20 sugar:80 water:60 roseWater:6 cardamom:1 | mix milkPowder flour ghee milk | shape milkPowder | deep milkPowder | syrup sugar water cardamom roseWater | soak:20 milkPowder sugar
chole chickpea:120 onion:40 tomato:80 ginger:8 garlic:6 garam:4 cumin:2 oil:15 | soak:480 chickpea | fry onion ginger garlic oil | simmer:30 chickpea tomato garam cumin
rogan-josh lamb:180 yogurt:50 onion:50 garlic:8 ginger:8 paprika:6 chili:6 ghee:20 | fry onion garlic ginger ghee | slow:60 lamb yogurt paprika chili
jalebi flour:40 yogurt:30 sugar:80 water:60 saffron:0.2 oil:20 | ferment flour yogurt | syrup sugar water saffron | deep flour oil | soak:2 flour sugar
kyiv-cutlet chicken:160 butter:25 herb:5 flour:15 egg:40 breadcrumb:30 oil:20 | mix butter herb | wrap chicken > butter | crisp chicken flour egg breadcrumb oil
syrnyky quark:150 egg:40 flour:30 sugar:15 oil:15 sourCream:30 | mix quark egg flour sugar | shape quark | fry quark oil | serve sourCream
holubtsi cabbage:120 rice:50 beef:60 onion:40 tomato:60 | boil cabbage | fry onion beef | mix rice beef onion | wrap cabbage > rice beef | simmer:40 cabbage tomato
deruny potato:200 egg:40 flour:20 onion:30 oil:20 sourCream:30 salt:3 | mix potato egg flour onion salt | fry potato oil | serve sourCream
langos flour:100 yeast:3 milk:50 salt:2 oil:20 sourCream:30 cheese:20 | knead flour yeast milk salt | rise:40 flour | deep flour oil | assemble flour sourCream cheese
kurtos flour:100 egg:40 butter:30 sugar:40 yeast:3 milk:30 cinnamon:2 | knead flour egg butter sugar yeast milk | shape flour | bake:15 | glaze sugar cinnamon
paprikash chicken:180 onion:80 paprika:12 sourCream:40 oil:20 | fry onion oil | simmer:30 chicken paprika | finish sourCream
lecso bellPepper:150 tomato:100 onion:60 sausage:60 oil:15 paprika:6 | fry onion sausage oil | simmer:20 bellPepper tomato paprika
lomo-saltado beef:150 onion:50 tomato:60 potato:120 soy:15 oil:20 | fry potato oil | sear beef | fry onion tomato | toss beef soy potato
causa potato:200 lime:20 chili:6 chicken:80 mayonnaise:25 avocado:40 | boil potato | mash potato lime chili | layer potato chicken mayonnaise avocado | chill:30 potato
aji-de-gallina chicken:150 bread:30 milk:80 walnut:20 aji:8 onion:30 parmesan:15 | boil chicken | blend bread milk walnut aji onion | simmer:10 chicken bread | finish parmesan
anticuchos heart:180 vinegar:20 chili:8 garlic:6 cumin:2 oil:10 | marinate:30 heart vinegar chili garlic cumin | grill heart oil
rocoto rocoto:80 beef:60 onion:30 cheese:30 egg:30 milk:40 | fry beef onion | wrap rocoto > beef cheese | bake:20 egg milk
harira tomato:100 lentil:40 chickpea:40 beef:50 onion:40 cilantro:10 spice:3 vermicelli:20 | fry onion | simmer:40 tomato lentil chickpea beef spice | boil vermicelli | finish cilantro
pastilla phyllo:70 chicken:100 almond:30 egg:40 sugar:20 cinnamon:2 onion:40 butter:30 | simmer:25 chicken onion | mix chicken almond egg cinnamon | layer phyllo chicken | glaze butter sugar | bake:25
msemen flour:100 semolina:30 oil:20 water:50 salt:2 butter:15 | knead flour semolina oil water salt | shape flour | fry flour butter
rfissa flour:80 water:50 salt:2 chicken:150 lentil:40 onion:40 fenugreek:2 spice:4 | knead flour water salt | fry flour | slow:40 chicken lentil onion fenugreek spice | assemble flour chicken
bigos sauerkraut:150 pork:60 sausage:50 mushroom:40 onion:40 tomato:30 | fry onion pork sausage | slow:60 sauerkraut mushroom tomato
zurek rye:30 water:200 sausage:60 egg:50 potato:80 garlic:5 sourCream:20 | ferment rye water | simmer:20 sausage potato garlic | boil egg | finish sourCream
golabki cabbage:120 rice:50 beef:60 onion:40 tomato:80 | boil cabbage | fry onion beef | mix rice beef | wrap cabbage > rice beef | simmer:40 cabbage tomato
placki potato:200 egg:30 onion:20 flour:15 oil:20 salt:3 | mix potato egg onion flour salt | fry potato oil
raclette cheese:100 potato:150 pickle:30 | boil potato | melt cheese | assemble potato cheese pickle
rosti potato:200 butter:20 salt:3 | fry potato butter salt | rest:2 potato
geschnetzeltes veal:160 mushroom:50 cream:80 onion:30 wine:40 butter:15 | fry onion mushroom butter | sear veal | simmer:10 veal cream wine
sauerbraten beef:200 vinegar:40 onion:50 carrot:40 spice:3 ginger:8 stockBeef:150 | marinate:1440 beef vinegar onion carrot spice ginger | slow:90 beef stockBeef
bratwurst sausage:100 bread:50 mustard:15 | fry sausage | assemble bread sausage mustard
sauerkraut cabbage:200 salt:6 caraway:2 | season cabbage salt caraway | pickle cabbage salt
black-forest sponge:120 cherry:80 cream:100 chocolate:40 kirsch:15 sugar:20 | whip cream sugar | layer sponge cherry cream chocolate kirsch
eintopf beef:100 potato:100 carrot:60 cabbage:60 onion:40 stock:400 | fry onion | simmer:40 beef potato carrot cabbage onion stock
spatzle flour:100 egg:50 water:30 salt:2 butter:15 | mix flour egg water salt | boil flour | drain flour | fry flour butter
kartoffelsalat potato:200 onion:40 vinegar:15 oil:15 mustard:8 stock:40 | boil potato | mix onion vinegar oil mustard stock | toss potato onion
khinkali flour:90 water:45 salt:3 beef:70 onion:20 herb:8 blackPepper:1 | knead flour water salt | mix beef onion herb blackPepper | wrap flour water > beef onion | poach
lobio bean:150 onion:40 herb:15 walnut:20 spice:3 vinegar:10 | simmer:40 bean onion | mix bean herb walnut spice vinegar
churchkhela walnut:80 water:120 flour:20 sugar:40 | simmer:15 water flour sugar | glaze walnut sugar | rest:60 walnut
pkhali spinach:150 walnut:40 garlic:5 vinegar:10 herb:10 spice:2 | boil spinach | pound walnut garlic | mix spinach walnut vinegar herb spice
samsa flour:80 butter:25 water:30 lamb:70 onion:30 cumin:2 salt:3 | knead flour butter water | fry lamb onion cumin salt | wrap flour > lamb | bake:25
lagman flour:90 water:40 salt:2 beef:80 bellPepper:40 onion:40 tomato:50 oil:15 spice:3 | knead flour water salt | boil flour | fry beef onion bellPepper tomato oil spice | assemble flour beef
shashlik lamb:180 onion:50 vinegar:10 salt:3 | marinate:30 lamb onion vinegar salt | grill lamb
manti-uz wrapper:50 lamb:60 onion:30 squash:30 butter:15 | mix lamb onion | wrap wrapper > lamb onion squash | steam wrapper | serve butter
hummus chickpea:120 tahini:30 lemon:20 garlic:5 oliveOil:15 salt:2 | boil chickpea | blend chickpea tahini lemon garlic oliveOil salt
tabbouleh parsley:60 bulgur:30 tomato:50 onion:20 lemon:20 oliveOil:15 mint:5 | soak:15 bulgur | mix parsley bulgur tomato onion lemon oliveOil mint
shawarma lamb:140 bread:70 tahini:20 onion:30 tomato:30 pickle:20 | grill lamb | assemble bread lamb tahini onion tomato pickle
fattoush lettuce:40 tomato:50 cucumber:40 radish:20 bread:30 sumac:2 oliveOil:15 lemon:15 | toast bread | assemble lettuce tomato cucumber radish bread sumac oliveOil lemon
kibbeh bulgur:60 beef:80 onion:30 spice:3 pineNut:15 oil:20 | soak:20 bulgur | mix bulgur beef onion spice | wrap bulgur > beef pineNut | deep bulgur oil
manakish flour:100 water:60 yeast:3 salt:2 zaatar:15 oliveOil:20 | knead flour water yeast salt | rise:40 flour | shape flour | glaze zaatar oliveOil | bake:12
egusi melonSeed:40 greens:80 beef:60 palmOil:20 onion:40 chili:6 stock:200 | pound melonSeed | fry onion chili palmOil | simmer:20 melonSeed greens beef stock
suya beef:150 peanut:30 chili:8 ginger:5 salt:3 oil:10 | mix peanut chili ginger salt | grill beef oil | glaze beef peanut
pounded-yam yam:200 water:40 | boil yam | pound yam water
puff-puff flour:100 sugar:20 yeast:4 water:80 nutmeg:1 oil:20 | knead flour sugar yeast water nutmeg | rise:40 flour | deep flour oil
blini flour:60 egg:40 milk:150 butter:20 salt:1 sourCream:30 | whisk flour egg milk butter salt | fry flour | serve sourCream
olivier potato:80 egg:50 pea:40 sausage:50 pickle:40 carrot:40 mayonnaise:40 | boil potato | boil egg | boil carrot | mix potato egg pea sausage pickle carrot mayonnaise
stroganoff beef:150 onion:50 mushroom:40 sourCream:60 mustard:8 butter:15 | fry onion mushroom butter | sear beef | simmer:10 beef sourCream mustard
shchi cabbage:150 beef:60 potato:80 onion:40 carrot:40 tomato:40 stockBeef:300 | fry onion carrot | simmer:30 cabbage beef potato tomato stockBeef
pirozhki flour:100 yeast:3 milk:50 egg:30 sugar:10 beef:60 onion:30 oil:20 | knead flour yeast milk egg sugar | rise:40 flour | fry beef onion | wrap flour > beef onion | deep flour oil
kasha buckwheat:80 water:160 butter:15 salt:2 | simmer:15 buckwheat water salt | finish butter
gravlax salmon:150 salt:20 sugar:15 dill:10 | mix salmon salt sugar dill | cure:1440 salmon
kanelbulle flour:120 milk:60 butter:40 sugar:30 yeast:4 cinnamon:4 cardamom:1 | knead flour milk butter sugar yeast cardamom | rise:40 flour | shape flour cinnamon sugar | bake:12
smorgastarta bread:80 cream:60 shrimp:40 egg:40 dill:5 mayonnaise:20 | boil egg | whip cream | layer bread shrimp egg mayonnaise dill cream | chill:60 bread
pyttipanna potato:150 beef:60 onion:40 butter:15 egg:50 | fry potato beef onion butter | fry egg | assemble potato egg
strudel phyllo:50 apple:150 sugar:30 raisin:20 cinnamon:3 butter:30 breadcrumb:15 | mix apple sugar raisin cinnamon breadcrumb | wrap phyllo > apple | glaze butter | bake:30
sachertorte flour:50 chocolate:60 butter:50 sugar:50 egg:60 apricotJam:30 | melt chocolate butter | whisk egg sugar | fold flour | bake:30 | glaze apricotJam chocolate
tafelspitz beef:180 onion:40 carrot:40 celery:20 stock:400 horseradish:20 | simmer:90 beef onion carrot celery stock | serve horseradish
kaiserschmarrn flour:50 egg:60 milk:80 sugar:20 raisin:20 butter:20 | whisk flour egg milk sugar | fry flour butter raisin | shape flour
doro-wat chicken:180 onion:100 berbere:10 butter:30 egg:50 | fry onion butter | slow:40 chicken berbere | boil egg | finish egg
kitfo beef:150 butter:25 chili:6 cardamom:1 | mix beef butter chili cardamom | serve beef
tibs beef:150 onion:50 bellPepper:40 rosemary:2 oil:15 | sear beef | fry onion bellPepper rosemary oil | toss beef onion
asado beef:200 salt:6 | season beef salt | grill beef
choripan chorizo:80 bread:60 | grill chorizo | assemble bread chorizo
dulce-de-leche milk:250 sugar:50 vanilla:2 bakingSoda:1 | simmer:90 milk sugar vanilla bakingSoda | chill:30 milk
locro corn:80 squash:100 beef:80 onion:40 paprika:4 stock:300 | fry onion paprika | simmer:50 corn squash beef onion stock
milanesa beef:160 flour:15 egg:40 breadcrumb:40 oil:25 lemon:15 | crisp beef flour egg breadcrumb oil | serve lemon
bacalhau cod:150 potato:150 oliveOil:20 onion:40 garlic:6 egg:40 parsley:8 | soak:720 cod | boil potato | fry onion garlic oliveOil | mix cod potato egg parsley
pastel-de-nata flour:50 butter:30 yolk:40 sugar:40 milk:120 starch:10 cinnamon:1 | knead flour butter | custard yolk sugar milk starch | wrap flour > milk | bake:15 | finish cinnamon
caldo-verde kale:60 potato:120 sausage:50 onion:30 garlic:5 oliveOil:15 stock:400 | simmer:20 potato onion garlic stock | blend potato | finish kale sausage oliveOil
stamppot potato:200 kale:80 sausage:70 butter:20 milk:30 | boil potato kale | mash potato butter milk | fry sausage | assemble potato sausage
bitterballen beef:60 butter:20 flour:15 stockBeef:80 breadcrumb:25 egg:30 oil:20 | whisk butter flour stockBeef | mix beef | chill:60 beef | crisp beef breadcrumb egg oil
poffertjes flour:60 yeast:3 milk:100 egg:30 sugar:15 butter:15 | whisk flour yeast milk egg sugar | rise:30 flour | fry flour butter
moules-frites mussel:200 wine:80 onion:30 celery:20 butter:15 potato:150 oil:20 | fry onion celery butter | simmer:8 mussel wine | fry potato oil
waffle flour:80 egg:50 milk:120 butter:30 sugar:15 bakingPowder:4 | whisk flour egg milk butter sugar bakingPowder | bake:4
waterzooi chicken:160 leek:40 carrot:40 cream:80 egg:40 stockChicken:250 | simmer:25 chicken leek carrot stockChicken | finish cream egg
nasi-goreng rice:150 egg:50 shrimp:40 kecap:15 chili:6 garlic:6 scallion:15 oil:15 | fry garlic chili shrimp oil | fry rice egg | season rice kecap | finish scallion
rendang beef:180 coconutMilk:250 lemongrass:15 galangal:10 chili:10 garlic:8 onion:40 | fry onion garlic chili | slow:120 beef coconutMilk lemongrass galangal | reduce coconutMilk
satay chicken:140 peanutSauce:40 soy:10 lime:10 chili:4 | marinate:20 chicken soy | grill chicken | serve peanutSauce lime chili
gado-gado cabbage:40 potato:60 egg:50 bean:40 sprout:30 peanutSauce:40 cucumber:30 | boil cabbage potato egg bean sprout | assemble cabbage potato egg peanutSauce cucumber
nasi-lemak rice:120 coconutMilk:80 anchovy:15 peanut:15 egg:50 sambal:20 cucumber:30 | simmer:15 rice coconutMilk | fry anchovy | boil egg | assemble rice anchovy peanut egg sambal cucumber
laksa noodle:90 coconutMilk:200 shrimp:50 chili:8 lemongrass:12 fishSauce:12 tofu:40 | simmer:10 coconutMilk chili lemongrass | boil noodle | assemble noodle shrimp tofu fishSauce coconutMilk
roti-canai flour:100 water:50 butter:25 salt:2 egg:20 | knead flour water butter salt egg | shape flour | fry flour
adobo chicken:180 soy:30 vinegar:25 garlic:8 bay:1 blackPepper:2 | marinate:20 chicken soy vinegar garlic bay blackPepper | simmer:25 chicken
sinigang pork:120 tamarind:20 tomato:40 radish:30 greens:40 onion:30 stock:400 | simmer:30 pork tamarind tomato radish onion stock | finish greens
halo-halo ice:80 milk:60 fruit:40 bean:30 sugar:15 | mix milk sugar | assemble ice milk fruit bean
koshari rice:60 lentil:40 pasta:40 onion:40 tomato:60 chickpea:30 cumin:2 oil:15 | boil rice | boil lentil | boil pasta | fry onion oil | simmer:10 tomato cumin | assemble rice lentil pasta chickpea onion tomato
ful bean:150 oliveOil:15 lemon:15 cumin:2 garlic:5 | simmer:20 bean | mix bean oliveOil lemon cumin garlic
molokhia molokhia:80 stockChicken:300 garlic:8 cilantro:8 chicken:80 | simmer:15 molokhia stockChicken chicken | fry garlic cilantro | finish garlic
ghormeh herb:40 bean:50 beef:80 onion:40 driedLime:8 turmeric:2 oil:15 | fry herb onion oil | slow:60 beef bean turmeric driedLime
tahdig rice:100 yogurt:30 saffron:0.2 oil:20 potato:50 | boil rice | mix rice yogurt saffron | fry potato oil | steam rice potato
fesenjan walnut:60 pomegranate:80 chicken:150 onion:40 sugar:10 | fry onion | blend walnut pomegranate | slow:40 chicken walnut sugar
shakshuka egg:80 tomato:120 bellPepper:40 onion:30 cumin:2 paprika:3 oliveOil:15 | fry onion bellPepper oliveOil | simmer:10 tomato cumin paprika | finish egg
malawach flour:100 water:50 oil:20 salt:2 | knead flour water oil salt | shape flour | fry flour
ropa-vieja beef:180 onion:50 bellPepper:50 tomato:80 cumin:2 garlic:6 oliveOil:15 | slow:70 beef | fry onion bellPepper garlic oliveOil | simmer:15 beef tomato cumin
moros rice:80 blackBean:80 onion:30 cumin:2 garlic:5 bay:1 oil:15 | fry onion garlic oil | simmer:25 rice blackBean cumin bay
bandeja blackBean:80 rice:80 beef:70 egg:50 plantain:40 chorizo:40 avocado:40 | simmer:30 blackBean | fry beef chorizo plantain | fry egg | assemble blackBean rice beef egg plantain avocado
arepa cornmeal:100 water:80 salt:2 cheese:40 | mix cornmeal water salt | shape cornmeal | fry cornmeal | assemble cornmeal cheese
ajiaco chicken:150 potato:120 corn:40 onion:30 cream:40 caper:8 stockChicken:300 cilantro:8 | simmer:30 chicken potato corn onion stockChicken | finish cream caper cilantro
meat-pie flour:100 butter:40 water:30 beef:100 onion:40 gravy:40 | knead flour butter water | fry beef onion | mix beef gravy | wrap flour > beef | bake:35
pavlova white:60 sugar:80 cream:80 fruit:60 vinegar:3 | whip white sugar vinegar | shape white | bake:60 | whip cream | assemble white cream fruit
lamington sponge:100 chocolate:40 coconut:30 butter:20 milk:30 | melt chocolate butter milk | glaze sponge chocolate | finish coconut
svickova beef:180 cream:80 carrot:40 onion:40 celery:20 vinegar:10 bread:40 | slow:70 beef carrot onion celery vinegar | blend carrot cream | serve bread
trdelnik flour:100 butter:30 sugar:30 yeast:3 milk:40 cinnamon:3 | knead flour butter sugar yeast milk | shape flour | bake:12 | glaze sugar cinnamon
sarmale cabbage:100 rice:40 pork:60 onion:30 paprika:4 tomato:50 | boil cabbage | fry onion pork paprika | mix rice pork | wrap cabbage > rice pork | simmer:40 cabbage tomato
mici beef:80 pork:40 garlic:6 bakingSoda:2 thyme:1 | mix beef pork garlic bakingSoda thyme | shape beef | grill beef
bobotie beef:150 onion:40 bread:30 milk:50 egg:60 curryPaste:8 raisin:15 | fry beef onion curryPaste | mix bread milk raisin | layer beef egg | bake:25
bunny-chow bread:100 chicken:80 curryPaste:20 onion:40 tomato:50 potato:60 | fry onion curryPaste | simmer:20 chicken tomato potato | assemble bread chicken
thieb rice:90 fish:120 tomato:60 cabbage:40 carrot:40 onion:40 chili:6 | fry onion tomato chili | simmer:15 fish cabbage carrot | simmer:18 rice fish
yassa chicken:160 onion:120 lemon:30 mustard:10 chili:6 oil:15 | marinate:30 chicken onion lemon mustard chili | fry chicken oil | slow:25 chicken onion
`