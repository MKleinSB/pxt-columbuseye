
Diese Seite auf Github Pages bei [https://mkleinsb.github.io/pxt-columbuseye/](https://mkleinsb.github.io/pxt-columbuseye/) öffnen

# pxt-columbuseye 

Mit dem TCS34725 Sensor kann man die Rot, Grün und Blauanteile des Lichts messen. Verfügbare Erweiterungen für den Calliope mini verfügen über eine LED zur Beleuchtung, manche auch über einen Kunststoffring oder sogar einer Linse. Varianten mit Kunststoffring sind zu empfehlen, da dort der Abstand zum Objekt immer gleich groß ist.
Die vorliegende Erweiterung entstand für http://columbuseye.rub.de/. Dort gibt es auch (demnächst) die zugehörigen Arbeitsblätter für den Unterricht.

Dank an **Niels Dedring** für den netten Kontakt und die Rückmeldungen.

Originalcode der Erweiterung https://github.com/samnied/pxt-tcs34725 TCS34725 extension von **Samuel Niederer**. Danke!

| ![Grovesensor](https://github.com/MKleinSB/pxt-columbuseye/blob/master/grove.png) | ![Adafruitsensor](https://github.com/MKleinSB/pxt-columbuseye/blob/master/TCS34725.png) |
| :----------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|                                            _Grove RGB-Sensor_                                            |                                   _TCS34725 Sensor Breakout_                                   |


## Blöcke 
### starte Farbsensor

Initialisiert den TCS34725 RGB-Sensor. **Muss** immer zu Beginn aufgerufen werden.

```sig
TCS34725.start()
```

### lerne Farbe

Speichert die Farbdaten in die angegebene Farbe um diese dann später wiederzuerkennen. Theoretisch muss nicht schwarz in schwarz gespeichert werden, ist aber zum wiedererkennen besser. Außerdem leuchtet die LED in der entsprechenden Farbe. Die Speicherung der jeweiligen Farbe muss mit dem Knopf "A" bestätigt werden.
Wenn keine Farbdaten eingelernt werden wird auf Standardwerte zurückgegriffen.

```sig
TCS34725.LernFarbe(Wasserfarben.Schwarz)
```

### Farbdaten

Liest die Farbanteile (Jeweils 0-255) der aktuellen Farbe aus. Jeweils Für Rot, Grün und Blau.

```sig
TCS34725.getSensorData(RGB.RED)
```

### Zeichne Balken

Zeichnet einen Balken auf dem Calliope mini Display. Die Werte werden an die Displayhöhe von 5 roten LEDs angepasst, es können bis zu 5 Spalten angegeben werden. 0 ist die linke Spalte, 2 die mittlere und 4 die rechte. So kann man bequem die drei mit Farbdaten ausgelesenen RGB-Werte darstellen.  

```sig
TCS34725.zeichneBalken(0, Spalten.col0)
```

### Wasserfarbe erkannt

Liest den Farbsensor aus und vergleicht die Werte mit den eingelernten Daten. Um ungleichmäßigen Farbauftrag auszugleichen haben alle RGB-Werte eine voreingestellte Toleranz von +-30. Diese kann über den Block "Toleranz bei Farberkennung" angepasst werden. 

```sig
TCS34725.Wasserfarbe(Wasserfarben.Schwarz)
```

## ... mehr 
### Toleranz bei Farberkennung

Hiermit kann die Toleranz der Farberkennung verschärft oder erweitert werde. Voreinstellt ist +-30, d.h. jeder einzelne RGB-Wert kann um 30 nach oben oder unten abweichen.

```sig
TCS34725.Toleranzf(30)
```


### Farberkennung RGB

Liest den Farbsensor aus und vergleicht die Werte mit den angegebenen RGB Werten. Um ungleichmäßigen Farbauftrag auszugleichen haben alle RGB-Werte eine voreingestellte Toleranz von +-30. Diese kann über den Toleranzblock angepasst werden. 

```sig
TCS34725.Farberkennung(0, 0, 0)
```

## Beispielprogramm

![Grovesensor](https://github.com/MKleinSB/pxt-columbuseye/blob/master/mini-Screenshot.png)



#### Metadaten (verwendet für Suche, Rendering)

* for PXT/calliopemini
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
