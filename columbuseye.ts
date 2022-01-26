// Originalcode https://github.com/samnied/pxt-tcs34725
// TCS34725 extension Samuel Niederer
// Erweitert für http://columbuseye.rub.de von Michael Klein 8.-24.10.2020

const TCS34725_I2C_ADDRESS = 0x29        //I2C address of the TCS34725 (Page 34)

/* TCS34725 register addresses (Page 20)*/

const TCS34725_REGISTER_COMMAND = 0x80		// Specifies register address 

const TCS34725_REGISTER_ENABLE = 0x00		// Enables states and interrupts
const TCS34725_REGISTER_AIEN_ENABLE = 0x10	// RGBC interrupt enable. When asserted, permits RGBC interrupts to be generated.
const TCS34725_REGISTER_WEN_ENABLE = 0x08	// Wait enable. This bit activates the wait feature. Writing a 1 activates the wait timer. Writing a 0 disables the wait timer.
const TCS34725_REGISTER_AEN_ENABLE = 0x02	// RGBC enable. This bit actives the two-channel ADC. Writing a 1 activates the RGBC. Writing a 0 disables the RGBC.
const TCS34725_REGISTER_PON_ENABLE = 0x01	// Power ON. This bit activates the internal oscillator to permit the timers and ADC channels to operate. Writing a 1 activates the oscillator. Writing a 0 disables the oscillator

const TCS34725_REGISTER_ATIME = 0x01		// The RGBC timing register controls the internal integration time of the RGBC clear and IR channel ADCs in 2.4-ms increments.
const TCS34725_REGISTER_WTIME = 0x03		// Wait time is set 2.4 ms increments unless the WLONG bit is asserted, in which case the wait times are 12× longer. WTIME is programmed as a 2's complement number.

const TCS34725_REGISTER_AILTL = 0x04		// Clear interrupt low threshold low byte
const TCS34725_REGISTER_AILTH = 0x05		// Clear interrupt low threshold high byte
const TCS34725_REGISTER_AIHTL = 0x06		// Clear interrupt high threshold low byte
const TCS34725_REGISTER_AIHTH = 0x07		// Clear interrupt high threshold high byte

const TCS34725_REGISTER_PERS = 0x0C		    // The persistence register controls the filtering interrupt capabilities of the device.

const TCS34725_REGISTER_CONFIG = 0x0D		// The configuration register sets the wait long time.
const TCS34725_REGISTER_CONFIG_WLONG = 0x02	// Configuration: Wait Long. When asserted, the wait cycles are increased by a factor 12× from that programmed in the WTIME register

const TCS34725_REGISTER_CONTROL = 0x0F		// The Control register provides eight bits of miscellaneous control to the analog block. These bits typically control functions such as gain settings and/or diode selection
const TCS34725_REGISTER_ID = 0x12		    // The ID Register provides the value for the part number. The ID register is a read-only register.

const TCS34725_REGISTER_STATUS = 0x13		    // The Status Register provides the internal status of the device. This register is read only.
const TCS34725_REGISTER_STATUS_AINT = 0x10		// Device status: RGBC clear channel Interrupt
const TCS34725_REGISTER_STATUS_AVALID = 0x01	// Device status: RGBC Valid. Indicates that the RGBC channels have completed an integration cycle

const TCS34725_REGISTER_CDATAL = 0x14		// Clear data low byte
const TCS34725_REGISTER_CDATAH = 0x15		// Clear data high byte

const TCS34725_REGISTER_RDATAL = 0x16		// Red data low byte
const TCS34725_REGISTER_RDATAH = 0x17		// Red data high byte

const TCS34725_REGISTER_GDATAL = 0x18		// Green data low byte
const TCS34725_REGISTER_GDATAH = 0x19		// Green data high byte

const TCS34725_REGISTER_BDATAL = 0x1A		// Blue data low byte
const TCS34725_REGISTER_BDATAH = 0x1B		// Blue data high byte


/* #region Enums for Modes, etc */

// Parameters for setting the internal integration time of the RGBC clear and IR channel.
enum TCS34725_ATIME {
    TIME_2_4_MS = 0xFF,    // 1 2.4 ms 1024
    TIME_24_MS = 0xF6,     // 10 24 ms 10240
    TIME_100_MS = 0xD5,    // 42 101 ms 43008
    TIME_154_MS = 0xC0,    // 64 154 ms 65535
    TIME_700_MS = 0x00     // 256 700 ms 65535
}

enum  Spalten {
    //% block="0"
    col0 = 0, 
    //% block="1"
    col1 = 1, 
    //% block="2"
    col2 = 2,
    //% block="3"
    col3 = 3, 
    //% block="4"
    col4 = 4

}


// Parameters for setting the wait time register.
enum TCS34725_WTIME {
    WTIME_2_4_MS = 0xFF,    // 1 2.4 ms 0.029 sec
    WTIME_204_MS = 0xAB,    // 85 204 ms 2.45 sec
    WTIME_614_MS = 0x00     // 256 614 ms 7.4 sec
}

// Parameters for...
enum RGB {
    //% block="red"
    RED,
    //% block="green"
    GREEN,
    //% block="blue"
    BLUE,
    //% block="luminance"
    CLEAR_LIGHT
}

enum Wasserfarben {
    //% block="Black"
    Schwarz,
    //% block="Magenta red"
    Magenta,
    //% block="Vermillon dark"
    Zinnober,
    //% block="Yellow"
    Gelb,
    //% block="Orange"
    Orange,
    //% block="Yellow ochre"
    Ocker,
    //% block="Violet"
    Violett,
    //% block="Ultramarine"
    Ultramarin,
    //% block="Cyan blue"
    Cyan,
    //% block="Blue green"
    Blaugr,
    //% block="Yellow green"
    Gelbgr,
    //% block="Burnt Sienna"   
    GebrSiena,
}

let schwarz = [71, 88, 103]
let magenta = [111, 89, 150]
let zinnober = [125, 71, 75]
let gelb = [150, 200, 110]
let orange = [170, 165, 120]
let ocker = [86, 116, 89]
let violett = [80, 90, 180]
let ultramarin = [44, 77, 190]
let cyan = [50, 166, 255]
let blaugr = [50, 120, 120]
let gelbgr = [94, 190, 130]
let gebrsiena = [90, 88, 82]


// Parameters for setting the persistence register. The persistence register controls the filtering interrupt capabilities of the device.
enum TCS34725_APERS {
    APERS_0_CLEAR = 0b0000,      // Every RGBC cycle generates an interrupt
    APERS_1_CLEAR = 0b0001,      // 1 clear channel value outside of threshold range
    APERS_2_CLEAR = 0b0010,      // 2 clear channel consecutive values out of range
    APERS_3_CLEAR = 0b0011,      // 3 clear channel consecutive values out of range
    APERS_5_CLEAR = 0b0100,      // 5 clear channel consecutive values out of range
    APERS_10_CLEAR = 0b0101,     // 10 clear channel consecutive values out of range
    APERS_15_CLEAR = 0b0110,     // 15 clear channel consecutive values out of range
    APERS_20_CLEAR = 0b0111,     // 20 clear channel consecutive values out of range
    APERS_25_CLEAR = 0b1000,     // 25 clear channel consecutive values out of range
    APERS_30_CLEAR = 0b1001,     // 30 clear channel consecutive values out of range
    APERS_35_CLEAR = 0b1010,     // 35 clear channel consecutive values out of range
    APERS_40_CLEAR = 0b1011,     // 40 clear channel consecutive values out of range
    APERS_45_CLEAR = 0b1100,     // 45 clear channel consecutive values out of range
    APERS_50_CLEAR = 0b1101,     // 50 clear channel consecutive values out of range
    APERS_55_CLEAR = 0b1110,     // 55 clear channel consecutive values out of range
    APERS_60_CLEAR = 0b1111,     // 60 clear channel consecutive values out of range
}

// Parameters for setting the gain of the sensor.
enum TCS34725_AGAIN {
    GAIN_1X = 0x0,      // 1x gain
    GAIN_4X = 0x1,      // 4x gain
    GAIN_16X = 0x2,      // 16x gain
    GAIN_60X = 0x3       // 60x gain
}

let Toleranz = 30 // Toleranz und RGB-Werte festlegen
let RGBB = 0
let RGBG = 0
let RGBR = 0

//Functions for helping with reading and writing registers of different sizes
namespace RegisterHelper {

    /**
     * Write register of the address location
     */
    export function writeRegister(addr: number, reg: number, dat: number): void {
        let _registerBuffer = pins.createBuffer(2);
        _registerBuffer[0] = reg;
        _registerBuffer[1] = dat;
        pins.i2cWriteBuffer(addr, _registerBuffer);
    }

    /**
     * Read a 8-byte register of the address location
     */
    export function readRegister8(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
    }

    /**
     * Read a (UInt16) 16-byte register of the address location
     */
    export function readRegisterUInt16(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt16LE);
    }

    /**
     * Read a (Int16) 16-byte register of the address location
     */
    export function readRegisterInt16(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int16LE);
    }

}

//% weight=100 color=#5d8af9 icon="\uf06e" block="columbuseye"
//% groups='["On Start","Sensor"]'
namespace TCS34725 {

    let TCS34725_I2C_ADDR = TCS34725_I2C_ADDRESS;
    export let isConnected = false;
    let atimeIntegrationValue = 0;
    let gainSensorValue = 0

    export function initSensor() {
        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | TCS34725_REGISTER_ID (0x12)
        let device_id = RegisterHelper.readRegister8(TCS34725_I2C_ADDRESS, TCS34725_REGISTER_COMMAND | TCS34725_REGISTER_ID)

        //Check that device Identification has one of 2 i2c addresses         
        if ((device_id != 0x44) && (device_id != 0x10)) {
            isConnected = false;
        }
        else
            isConnected = true;
    }

    export function turnSensorOn(atime: TCS34725_ATIME) {

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER VALUE:    TCS34725_REGISTER_COMMAND (0x80) | TCS34725_REGISTER_ENABLE (0x00)
        //REGISTER WRITE:    TCS34725_REGISTER_PON_ENABLE (0x01)
        RegisterHelper.writeRegister(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | TCS34725_REGISTER_ENABLE, TCS34725_REGISTER_PON_ENABLE);
        basic.pause(300);


        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER VALUE:    TCS34725_REGISTER_COMMAND (0x80) | TCS34725_REGISTER_ENABLE (0x00)
        //REGISTER WRITE:    TCS34725_REGISTER_PON_ENABLE (0x01) | TCS34725_REGISTER_AEN_ENABLE (0x02)        
        RegisterHelper.writeRegister(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | TCS34725_REGISTER_ENABLE, TCS34725_REGISTER_PON_ENABLE | TCS34725_REGISTER_AEN_ENABLE);

        pauseSensorForIntegrationTime(atime);
    }

    export function pauseSensorForIntegrationTime(atime: TCS34725_ATIME) {
        switch (atime) {
            case TCS34725_ATIME.TIME_2_4_MS: {
                basic.pause(2.4);
                break;
            }
            case TCS34725_ATIME.TIME_24_MS: {
                basic.pause(24);
                break;
            }
            case TCS34725_ATIME.TIME_100_MS: {
                basic.pause(100);
                break;
            }
            case TCS34725_ATIME.TIME_154_MS: {
                basic.pause(154);
                break;
            }
            case TCS34725_ATIME.TIME_700_MS: {
                basic.pause(700);
                break;
            }
        }
    }

    export function turnSensorOff() {
        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | TCS34725_REGISTER_ID (0x12)        
        let sensorReg = RegisterHelper.readRegister8(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | TCS34725_REGISTER_ENABLE);

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER VALUE:    TCS34725_REGISTER_COMMAND (0x80) | TCS34725_REGISTER_ENABLE (0x00)
        //REGISTER WRITE:    sensorReg & ~(TCS34725_REGISTER_PON_ENABLE (0x01) | TCS34725_REGISTER_AEN_ENABLE (0x02))            
        RegisterHelper.writeRegister(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | TCS34725_REGISTER_ENABLE, sensorReg & ~(TCS34725_REGISTER_PON_ENABLE | TCS34725_REGISTER_AEN_ENABLE));
    }

    export function setATIMEintegration(atime: TCS34725_ATIME) {
        //Always make sure the color sensor is connected. Useful for cases when this block is used but the sensor wasn't set randomly. 
        if (!isConnected)
            initSensor()

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER VALUE:    TCS34725_REGISTER_COMMAND (0x80) | TCS34725_REGISTER_ATIME (0x01)
        //REGISTER WRITE:    atime                
        RegisterHelper.writeRegister(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | TCS34725_REGISTER_ATIME, atime)

        atimeIntegrationValue = atime;

    }

    export function setGAINsensor(gain: TCS34725_AGAIN) {
        //Always make sure the color sensor is connected. Useful for cases when this block is used but the sensor wasn't set randomly. 
        if (!isConnected)
            initSensor()

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER VALUE:    TCS34725_REGISTER_COMMAND (0x80) | TCS34725_REGISTER_CONTROL (0x0F)
        //REGISTER WRITE:    gain         
        RegisterHelper.writeRegister(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | TCS34725_REGISTER_CONTROL, gain)

        gainSensorValue = gain;
    }
    /**
     * Startet den Sensor mit 50fach Steigerung (gain) und 100ms Integrationszeit 
     * MUSS immer zu Beginn aufgerufen werden
     **/
    //% blockId="start_colorSensor" block="start colorsensor (100ms)"
    //% group="On Start"
    export function start(){

        while (!isConnected) {
            initSensor();
        }

        setATIMEintegration(TCS34725_ATIME.TIME_100_MS); // Integrationtime 2,4 ms
        setGAINsensor(TCS34725_AGAIN.GAIN_60X);  //gain 50
        turnSensorOn(TCS34725_ATIME.TIME_100_MS);
    }

    export type RGBC = {
        red: number,
        green: number,
        blue: number,
        clear: number
    };

    export function getSensorRGB(): RGBC {
        //Always check that sensor is/was turned on
        while (!isConnected) {
            initSensor();
        }

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | TCS34725_REGISTER_RDATAL (0x16)          
        let redColorValue = RegisterHelper.readRegisterUInt16(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | TCS34725_REGISTER_RDATAL);

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | TCS34725_REGISTER_GDATAL (0x18)          
        let greenColorValue = RegisterHelper.readRegisterUInt16(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | TCS34725_REGISTER_GDATAL);

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | TCS34725_REGISTER_BDATAL (0x1A)          
        let blueColorValue = RegisterHelper.readRegisterUInt16(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | TCS34725_REGISTER_BDATAL);

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | TCS34725_REGISTER_CDATAL (0x14)          
        let clearColorValue = RegisterHelper.readRegisterUInt16(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | TCS34725_REGISTER_CDATAL);

        pauseSensorForIntegrationTime(atimeIntegrationValue);

        let sum = clearColorValue;
        let r = 0;
        let g = 0;
        let b = 0;

        if (clearColorValue == 0) {
            return {
                red: 0,
                green: 0,
                blue: 0,
                clear: 0
            }
        }
        else {
            r = redColorValue / sum * 255;
            g = greenColorValue / sum * 255;
            b = blueColorValue / sum * 255;

            return {
                red: Math.round(r),
                green: Math.round(g),
                blue: Math.round(b),
                clear: clearColorValue
            }
        }
    }

    /**
     * Liest die entsprechenden Farbdaten vom Sensor 
     **/
    //% blockId="getSensorData" block="get colordata %colorId"
    //% group="Sensor"
    export function getSensorData(colorId: RGB): number {
        let data = getSensorRGB();
        let color = 0;

        switch (colorId) {
            case RGB.RED: color = data.red;
                break;
            case RGB.GREEN: color = data.green;
                break;
            case RGB.BLUE: color = data.blue;
                break;
            case RGB.CLEAR_LIGHT: color = data.clear;
                break;
        }

        return color;
    }

    /**
    * Speichert die RGB-Werte der angegebenen Farbe
    **/
    //% color.fieldEditor="gridpicker"
    //% color.fieldOptions.width=200
    //% color.fieldOptions.columns=4
    //% blockId="LernFarbe" block="learn color %color"
    //% group="On Start"
    export function LernFarbe (color:Wasserfarben) {

    basic.showIcon(IconNames.ArrowWest)
    switch (color) {
    case Wasserfarben.Schwarz : { basic.setLedColor(0x000000)
    while (!(input.buttonIsPressed(Button.A))) { }
    schwarz = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break;
    case Wasserfarben.Magenta : { basic.setLedColor(0xff00ff)
    while (!(input.buttonIsPressed(Button.A))) { }
    magenta = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break; 
    case Wasserfarben.Zinnober : { basic.setLedColor(0xff0000)
    while (!(input.buttonIsPressed(Button.A))) { }
    zinnober = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break;
    case Wasserfarben.Gelb : { basic.setLedColor(0xffff00)
    while (!(input.buttonIsPressed(Button.A))) { }
    gelb = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break;
    case Wasserfarben.Orange : { basic.setLedColor(0xff8000)
    while (!(input.buttonIsPressed(Button.A))) { }
    orange = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break;
    case Wasserfarben.Ocker : { basic.setLedColor(0xD4A012)
    while (!(input.buttonIsPressed(Button.A))) { }
    ocker = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break;
    case Wasserfarben.Violett : { basic.setLedColor(0x7f00ff) 
    while (!(input.buttonIsPressed(Button.A))) { }
    violett = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break;
    case Wasserfarben.Ultramarin : { basic.setLedColor(0x0000ff)
    while (!(input.buttonIsPressed(Button.A))) { }
    ultramarin = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break;
    case Wasserfarben.Cyan : { basic.setLedColor(0x3399ff)
    while (!(input.buttonIsPressed(Button.A))) { }
    cyan = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break;
    case Wasserfarben.Blaugr : { basic.setLedColor(0x008000)
    while (!(input.buttonIsPressed(Button.A))) { }
    blaugr = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break;
    case Wasserfarben.Gelbgr : { basic.setLedColor(0xadff2f)
    while (!(input.buttonIsPressed(Button.A))) { }
    gelbgr = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break;
    case Wasserfarben.GebrSiena : { basic.setLedColor(0xa0522d)
    while (!(input.buttonIsPressed(Button.A))) { }
    gebrsiena = [TCS34725.getSensorData(RGB.RED), TCS34725.getSensorData(RGB.GREEN), TCS34725.getSensorData(RGB.BLUE)]}
     break;
     }
    basic.setLedColor(0x000000)
    basic.showIcon(IconNames.Yes)
    basic.pause(100)
    basic.clearScreen()
    }


    /**
    * Zeichnet eine Säule mit bis zu 5 LEDs auf der LED-Anzeige 
    * an einer der 5 Spalten.
    **/
    //% Position.fieldEditor="gridpicker"
    //% Position.fieldOptions.width=200
    //% Position.fieldOptions.columns=5
    //% blockId="zeichneSaule" block="draw bar with value %Wert  | at column | %Position"
    export function zeichneSaule (Wert: number, Position: Spalten) {
    for (let Index = 0; Index <= 4; Index++) {
        led.unplot(Position, 4 - Index)   
    }
    for (let Index = 0; Index <= pins.map(Wert,0,255,0,5); Index++) {
          if (Wert > 40) {
            led.plot(Position, 4 - Index)
           }
       }
    }

  
   
    /**
    * Toleranz zur Farberkennung festlegen (Standard +-30)
    **/
    //% advanced=true
    //% tol.defl=30
    //% blockId="Toleranzf" block="set tolerance for color recognition %tol"
    export function Toleranzf (tol:number) {
    Toleranz = tol
        }

    /**
    * Erkennt eine Pelikan Wasserfarbe mit einer gewissen Toleranz
    **/
    //% color.fieldEditor="gridpicker"
    //% color.fieldOptions.width=200
    //% color.fieldOptions.columns=4
    //% blockId="Wasserfarbe" block="water color %color recognized"
    export function Wasserfarbe (color:Wasserfarben): boolean {
        let erkannt : boolean;

    switch (color) {
    case Wasserfarben.Schwarz : erkannt = TCS34725.Farberkennung(schwarz[0], schwarz[1], schwarz[2])
     break;
    case Wasserfarben.Magenta : erkannt = TCS34725.Farberkennung(magenta[0], magenta[1], magenta[2])
     break; //
    case Wasserfarben.Zinnober : erkannt = TCS34725.Farberkennung(zinnober[0], zinnober[1], zinnober[2])
     break; //
    case Wasserfarben.Gelb : erkannt = TCS34725.Farberkennung(gelb[0], gelb[1], gelb[2]) 
     break; //
    case Wasserfarben.Orange : erkannt = TCS34725.Farberkennung(orange[0], orange[1], orange[2])
     break; //
    case Wasserfarben.Ocker : erkannt = TCS34725.Farberkennung(ocker[0], ocker[1], ocker[2])  
     break; //
    case Wasserfarben.Violett : erkannt = TCS34725.Farberkennung(violett[0], violett[1], violett[2])   
     break;//
    case Wasserfarben.Ultramarin : erkannt = TCS34725.Farberkennung(ultramarin[0], ultramarin[1], ultramarin[2])  
     break;//
    case Wasserfarben.Cyan : erkannt = TCS34725.Farberkennung(cyan[0], cyan[1], cyan[2])
     break;//
    case Wasserfarben.Blaugr : erkannt = TCS34725.Farberkennung(blaugr[0], blaugr[1], blaugr[2])   
     break; //
    case Wasserfarben.Gelbgr : erkannt = TCS34725.Farberkennung(gelbgr[0], gelbgr[1], gelbgr[2])
     break; //
    case Wasserfarben.GebrSiena : erkannt = TCS34725.Farberkennung(gebrsiena[0], gebrsiena[1], gebrsiena[2])
     break; //
    }
    return erkannt
        
    }

    /**
    * Farberkennung über die drei RGB - Werte
    **/
    //% advanced=true
    //% blockId="Farberkennung" block="color recognition R %RWert G %GWert B %BWert"
    export function Farberkennung (RWert: number, GWert: number, BWert: number) {
     RGBR = TCS34725.getSensorData(RGB.RED)
     RGBG = TCS34725.getSensorData(RGB.GREEN)
     RGBB = TCS34725.getSensorData(RGB.BLUE)
      if (RWert >= RGBR - Toleranz && RWert <= RGBR + Toleranz) {
        if (GWert >= RGBG - Toleranz && GWert <= RGBG + Toleranz) {
           if (BWert >= RGBB - Toleranz && BWert <= RGBB + Toleranz) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false
    }
  }

    /**
    * Farbmemoryspiel: Nach dem Anlernen der 5 Farben zeigt der Calliope mini 2 Farben an
    * die Du suchen und mit Knopf A bestätigen musst. Hast Du die richtigen Farben
    * wiedergefunden geht das Spiel weiter mit 3, 4 usw. Farben. Wer sich die meisten
    * Farben merken kann, erhält die meisten Punkte.
    **/
    //% advanced=true
    //% blockId="Farbmemory" block="color memory game"
    export function Farbmemory () {
    let LEDFarbArray: number[] = []
    let FarbArray: number[] = []
    let Zufallsarray: number[] = []
    TCS34725.start()
    TCS34725.Toleranzf(20)
    game.setScore(0)
    FarbArray = [Wasserfarben.Blaugr, Wasserfarben.Zinnober, Wasserfarben.Violett, Wasserfarben.Ultramarin, Wasserfarben.Gelb]
    LEDFarbArray = [Colors.Green, Colors.Red, Colors.Violet, Colors.Blue, Colors.Yellow]
    for (let Index2 = 0; Index2 <= 4; Index2++) {
        TCS34725.LernFarbe(FarbArray[Index2])
    }
    while (true) {
        game.addScore(1)
        basic.pause(500)
        for (let i = 0; i <= game.score(); i++) {
            music.playTone(392, music.beat(BeatFraction.Quarter))
            Zufallsarray[i] = randint(0, 4)
            basic.setLedColor(LEDFarbArray[Zufallsarray[i]])
            basic.pause(1000)
            basic.setLedColor(0x000000)
            basic.pause(500)
        }
        for (let j = 0; j <= game.score(); j++) {
            basic.showIcon(IconNames.ArrowWest)
            while (!(input.buttonIsPressed(Button.A))) {
            	
            }
            if ((TCS34725.Wasserfarbe(FarbArray[Zufallsarray[j]]))) {
                basic.showIcon(IconNames.Happy)
                basic.pause(500)
            } else {
                game.gameOver()
            }
        }
    }
}


}