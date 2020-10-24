// Sensor initialisieren
TCS34725.start()
// Farbe Cyanblau einlernen
TCS34725.LernFarbe(Wasserfarben.Cyan)
basic.forever(function () {
    if (TCS34725.Wasserfarbe(Wasserfarben.Cyan)) {
        basic.setLedColor(0x3399ff)
    } else {
        basic.setLedColor(0xff0000)
    }
})
