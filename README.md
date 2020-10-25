
> Diese Seite bei [https://mkleinsb.github.io/pxt-columbuseye/](https://mkleinsb.github.io/pxt-columbuseye/) öffnen

![columbuseye](https://github.com/MKleinSB/pxt-columbuseye/raw/master/icon.png)


## Blöcke 
### starte Farbsensor

Initialisiert den TCS34725 RGB-Sensor. **Muss** immer zu Beginn aufgerufen werden.

```sig
TCS34725.start()
```

### lerne Farbe

Speichert die Farbdaten in die angegebene Farbe um diese dann später wiederzuerkennen. Theoretisch muss nicht schwarz in schwarz gespeichert werden, ist aber zum wiedererkennen besser. Außerdem leuchtet die LED in der entsprechenden Farbe. Die Speicherung der jeweiligen Farbe muss mit dem Knopf "A" bestätigt werden.

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



#### Metadaten (verwendet für Suche, Rendering)

* for PXT/calliopemini
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
