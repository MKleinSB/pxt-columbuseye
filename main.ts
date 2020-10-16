TCS34725.start()
basic.forever(function () {
    if (TCS34725.Wasserfarbe(Wasserfarben.Gelb)) {
        basic.setLedColor(0xffff00)
        basic.showString("G")
    } else if (TCS34725.Wasserfarbe(Wasserfarben.Orange)) {
        basic.setLedColor(0xff8000)
        basic.showString("O")
    } else if (TCS34725.Wasserfarbe(Wasserfarben.Zinnober)) {
        basic.setLedColor(0xff0000)
        basic.showString("Z")
    } else if (TCS34725.Farberkennung(111, 89, 150)) {
        basic.setLedColor(0xff00ff)
        basic.showString("M")
    } else if (TCS34725.Farberkennung(80, 90, 180)) {
        basic.setLedColor(0x7f00ff)
        basic.showString("V")
    } else if (TCS34725.Farberkennung(44, 77, 190)) {
        basic.setLedColor(0x0000ff)
        basic.showString("U")
    }
})
