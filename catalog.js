/* ===== CATALOG =====
   Each line: [name, category, price in PHP, brand, short description, "spec|spec|spec", optional tag]
   Add or edit items here. Prices/stock are sample values. */
const CATALOG = [
  ["ASUS ROG Zephyrus G14", "Laptops", 119995, "ASUS ROG", "Slim 14″ performance laptop", "14″ OLED 120Hz|AMD Ryzen 9|GeForce RTX 40-series|Up to 32GB RAM|Up to 1TB SSD", "BEST SELLER"],
  ["Lenovo Legion Pro 7i", "Laptops", 189995, "LENOVO", "16″ high-refresh powerhouse", "16″ WQXGA 240Hz|Intel Core i9|GeForce RTX 4080|32GB DDR5|1TB SSD"],
  ["Razer Blade 16", "Laptops", 219995, "RAZER", "CNC aluminum body, OLED display", "16″ OLED 240Hz|Intel Core i9|GeForce RTX 4070 or better|32GB DDR5|Thunderbolt 4", "PREMIUM"],
  ["Acer Predator Helios Neo 16", "Laptops", 84995, "ACER", "Great-value 16″ gaming laptop", "16″ WUXGA 165Hz|Intel Core i7|GeForce RTX 4060|16GB DDR5|512GB SSD"],
  ["MSI Katana 15", "Laptops", 69995, "MSI", "Entry-level gaming laptop", "15.6″ FHD 144Hz|Intel Core i7|GeForce RTX 4050|16GB RAM|512GB SSD", "VALUE"],
  ["Alienware m16 R2", "Laptops", 169995, "ALIENWARE", "Bold design, QHD+ display", "16″ QHD+ 240Hz|Intel Core Ultra 9|GeForce RTX 4070|32GB RAM|1TB SSD"],

  ["Wooting 60HE", "Keyboards", 10990, "WOOTING", "Analog 60% keyboard", "Hall-effect analog switches|Rapid Trigger|60% layout|USB-C|Fully remappable", "ANALOG"],
  ["Razer BlackWidow V4 Pro", "Keyboards", 16990, "RAZER", "Full-size with Command Dial", "Full-size layout|Mechanical switches|Command Dial + media keys|Magnetic wrist rest|Per-key RGB"],
  ["Keychron Q1 Pro", "Keyboards", 12990, "KEYCHRON", "Wireless custom 75% board", "75% layout|CNC aluminum body|Hot-swappable switches|QMK/VIA support|Bluetooth + USB-C", "CUSTOM"],
  ["Logitech G Pro X TKL Lightspeed", "Keyboards", 11990, "LOGITECH G", "Tournament-ready wireless TKL", "Tenkeyless|LIGHTSPEED wireless|Swappable GX switches|Per-key RGB|Bluetooth"],
  ["SteelSeries Apex Pro TKL", "Keyboards", 12990, "STEELSERIES", "Adjustable actuation keyboard", "OmniPoint adjustable switches|Tenkeyless|OLED smart display|Aluminum frame|Per-key RGB"],
  ["ASUS ROG Azoth", "Keyboards", 15990, "ASUS ROG", "Premium 75% custom-style board", "75% layout|Hot-swappable switches|OLED display|Gasket-mount design|Tri-mode wireless", "PREMIUM"],

  ["Logitech G Pro X Superlight 2", "Mice", 8990, "LOGITECH G", "Ultralight esports mouse", "Under 60g|HERO 2 sensor|LIGHTSPEED wireless|Optical-mechanical switches|Right-handed", "ESPORTS"],
  ["Razer DeathAdder V3 Pro", "Mice", 8490, "RAZER", "Ergonomic wireless classic", "About 63g|Focus Pro 30K sensor|HyperSpeed Wireless|Long battery life|Right-handed ergonomic"],
  ["Razer Viper V3 Pro", "Mice", 10990, "RAZER", "Symmetrical ultralight", "About 54g|Focus Pro 35K sensor|HyperSpeed Wireless|8K polling support|Ambidextrous"],
  ["Glorious Model O 2 Wireless", "Mice", 5490, "GLORIOUS", "Lightweight wireless mouse", "Lightweight ambidextrous shape|2.4GHz + Bluetooth|BAMF 2.0 sensor|Mechanical switches|Swappable feet"],
  ["SteelSeries Aerox 5 Wireless", "Mice", 6490, "STEELSERIES", "9-button FPS/MMO hybrid", "9 programmable buttons|TrueMove Air sensor|Quantum 2.0 wireless + Bluetooth|Ultralight design|IP54 rating", "9 BUTTONS"],
  ["Logitech G502 X Plus", "Mice", 12990, "LOGITECH G", "Iconic shape, wireless RGB", "LIGHTSPEED wireless|HERO 25K sensor|13 programmable controls|LIGHTFORCE hybrid switches|LIGHTSYNC RGB"],

  ["HyperX Cloud III Wireless", "Headsets", 8990, "HYPERX", "Comfort-first wireless headset", "53mm angled drivers|Up to 120 hours battery|DTS spatial audio|Noise-cancelling detachable mic|2.4GHz wireless", "LONG BATTERY"],
  ["SteelSeries Arctis Nova Pro Wireless", "Headsets", 22990, "STEELSERIES", "Hot-swap dual-battery system", "Hot-swappable batteries|Active noise cancellation|2.4GHz + Bluetooth|Base station with OLED|ClearCast Gen 2 mic", "PREMIUM"],
  ["Razer BlackShark V2 Pro", "Headsets", 9990, "RAZER", "Esports wireless headset", "50mm TriForce Titanium drivers|HyperSpeed Wireless|THX Spatial Audio|Detachable HyperClear mic|Long battery life"],
  ["Logitech G Pro X 2 Lightspeed", "Headsets", 14990, "LOGITECH G", "Pro-grade graphene audio", "50mm graphene drivers|LIGHTSPEED + Bluetooth|DTS Headphone:X 2.0|Detachable boom mic|Memory foam earpads"],
  ["Corsair HS80 Max Wireless", "Headsets", 9990, "CORSAIR", "Dolby Atmos wireless headset", "50mm neodymium drivers|Dolby Atmos support|Slipstream wireless + Bluetooth|Broadcast-grade mic|Long battery life"],
  ["Audeze Maxwell", "Headsets", 24990, "AUDEZE", "Planar magnetic gaming audio", "90mm planar magnetic drivers|Up to 80 hours battery|Wireless + Bluetooth|Detachable boom mic|PC, PlayStation and Xbox versions"],

  ["LG UltraGear 27GR95QE", "Monitors", 34990, "LG", "27″ OLED QHD 240Hz", "27″ QHD OLED|240Hz refresh rate|0.03ms response|HDR10|G-SYNC / FreeSync compatible", "OLED"],
  ["ASUS ROG Swift OLED PG27AQDM", "Monitors", 44990, "ASUS ROG", "Esports-grade 27″ OLED", "27″ QHD OLED|240Hz refresh rate|0.03ms response|Custom heatsink|G-SYNC compatible", "OLED"],
  ["Samsung Odyssey G7 32″", "Monitors", 29990, "SAMSUNG", "1000R curved QHD", "32″ QHD curved 1000R|240Hz refresh rate|1ms response|HDR600|G-SYNC / FreeSync"],
  ["Alienware AW3423DWF", "Monitors", 44990, "ALIENWARE", "34″ ultrawide QD-OLED", "34″ QD-OLED curved|3440×1440 resolution|165Hz|0.1ms response|FreeSync Premium Pro"],
  ["MSI MAG 274QRF-QD", "Monitors", 17990, "MSI", "Quantum-dot QHD value pick", "27″ QHD IPS|165Hz|1ms response|Quantum dot color|Adaptive-Sync", "VALUE"],
  ["BenQ ZOWIE XL2546K", "Monitors", 24990, "BENQ ZOWIE", "24.5″ esports monitor", "24.5″ FHD|240Hz|DyAc+ motion clarity|Height-adjustable stand|S-Switch controller"],

  ["Secretlab TITAN Evo", "Chairs", 32990, "SECRETLAB", "Ergonomic fan favorite", "4-way L-ADAPT lumbar support|Magnetic memory foam head pillow|Cold-cure foam|4D armrests|Multiple sizes", "FAN FAVORITE"],
  ["Herman Miller x Logitech G Embody", "Chairs", 59990, "HERMAN MILLER", "Ergonomic performance chair", "Pixelated support system|Adjustable seat depth|Breathable back|Ergonomic design|Built for long sessions", "PREMIUM"],
  ["Razer Iskur V2", "Chairs", 29990, "RAZER", "Built-in lumbar curve", "Adaptive lumbar support|4D armrests|Memory foam head cushion|Multi-tilt mechanism|Synthetic leather"],
  ["Corsair TC100 Relaxed", "Chairs", 14990, "CORSAIR", "Comfort for long sessions", "Wide comfortable seat|Soft breathable fabric|Adjustable armrests|Neck and lumbar pillows|Reclining backrest", "VALUE"],
  ["Noblechairs Hero", "Chairs", 34990, "NOBLECHAIRS", "Premium German-designed chair", "Vegan leather|Cold foam padding|4D armrests|Full steel frame|Lumbar and neck cushions"],
  ["AndaSeat Kaiser 3 XL", "Chairs", 27990, "ANDASEAT", "Big & tall support", "Extra-large seat|4D armrests|Magnetic head pillow|Lumbar support|Premium upholstery"]
];
