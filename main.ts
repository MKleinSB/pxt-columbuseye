TCS34725.start()
TCS34725.LernFarbe(Wasserfarben.Violett)
TCS34725.LernFarbe(Wasserfarben.Magenta)
basic.forever(function () {
    if (TCS34725.Wasserfarbe(Wasserfarben.Violett)) {
        basic.setLedColor(0x7f00ff)
    } else if (TCS34725.Wasserfarbe(Wasserfarben.Magenta)) {
        basic.setLedColor(0xff00ff)
    } else {
        basic.setLedColor(0x000000)
    }
})
