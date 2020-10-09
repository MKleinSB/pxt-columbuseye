basic.forever(function () {
    TCS34725.zeichneBalken(TCS34725.getSensorData(RGB.RED), Spalten.col0)
    TCS34725.zeichneBalken(TCS34725.getSensorData(RGB.GREEN), Spalten.col2)
    TCS34725.zeichneBalken(TCS34725.getSensorData(RGB.BLUE), Spalten.col4)
})
