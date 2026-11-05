// VAG car picker: model (search in Latin and Cyrillic) → year → engine.
// Replaces every text field named "model" in the booking form and the work-order with three linked lists.
// The chosen car goes into a hidden field "model" as "Passat B8 2016, 2.0 TDI", so main.js reads it as before.
// Loaded by main.js; works on every version of the site.
(function () {
  'use strict';
  var NOW = new Date().getFullYear();

  /* ── Data ────────────────────────────────────────────────────────────────
     Model: [name, search aliases separated by "|", generations]
     Generation: [label shown after the name, first year, last year (0 = still made), engines]
     Engines: comma separated; "@2016-2020" limits years inside the generation, "@2016-" means to its end.
     Fuel is read from the name: TDI/SDI/D/TD diesel; GTE, eHybrid, TFSI e, e-tron, iV, Hybrid hybrid; EV electric.
     Engines are those sold in Europe and the CIS, plus US versions that are often imported to Belarus. */
  var CARS = {
    vw: [
      ['Golf', 'гольф|гольв|golf|гольф плюс|спортсвен|спортсван|sportsvan', [
        ['2', 1983, 1992, '1.3, 1.6, 1.8, 1.6 D, 1.6 TD'],
        ['3', 1991, 1998, '1.4, 1.6, 1.8, 2.0, 2.8 VR6, 2.9 VR6@1994-, 1.9 D, 1.9 TD, 1.9 TDI@1993-, 1.9 SDI@1995-'],
        ['4', 1997, 2004, '1.4, 1.6, 1.6 FSI@2002-, 1.8, 1.8 T, 2.0, 2.3 V5, 2.8 V6, 3.2 VR6@2002-, 1.9 SDI, 1.9 TDI'],
        ['5', 2003, 2008, '1.4, 1.4 FSI, 1.4 TSI@2006-, 1.6, 1.6 FSI, 2.0 FSI, 2.0 TSI, 3.2 VR6@2005-, 1.9 TDI, 2.0 TDI, 2.0 SDI'],
        ['6', 2008, 2013, '1.2 TSI@2010-, 1.4, 1.4 TSI, 1.6, 2.0 TSI, 2.5@2010-, 1.6 TDI@2009-, 2.0 TDI'],
        ['7', 2012, 2020, '1.0 TSI@2015-, 1.2 TSI@2012-2018, 1.4 TSI@2012-2018, 1.5 TSI@2017-, 1.6@2015-, 1.8 TSI@2013-2019, 2.0 TSI, 1.4 TSI GTE@2014-, EV@2014-, 1.6 TDI, 2.0 TDI'],
        ['8', 2019, 0, '1.0 TSI, 1.5 TSI, 1.5 eTSI, 2.0 TSI, 1.4 eHybrid@2020-2024, 1.5 eHybrid@2024-, 2.0 TDI'],
        ['Plus', 2005, 2014, '1.2 TSI@2010-, 1.4, 1.4 TSI, 1.6, 1.6 FSI, 2.0 FSI@2005-2008, 1.9 TDI@2005-2008, 1.6 TDI@2009-, 2.0 TDI'],
        ['Sportsvan', 2014, 2020, '1.0 TSI@2016-, 1.2 TSI@2014-2018, 1.4 TSI@2014-2018, 1.5 TSI@2017-, 1.6 TDI, 2.0 TDI']
      ]],
      ['Polo', 'поло|polo', [
        ['III', 1994, 2001, '1.0, 1.4, 1.6, 1.9 D, 1.9 SDI, 1.9 TDI@1997-'],
        ['IV', 2001, 2009, '1.2, 1.4, 1.4 FSI@2002-2005, 1.6, 1.8 T@2006-, 1.4 TDI, 1.9 SDI, 1.9 TDI'],
        ['V', 2009, 2017, '1.0@2014-, 1.2, 1.2 TSI, 1.4, 1.4 TSI, 1.8 TSI@2015-, 1.2 TDI, 1.4 TDI@2014-, 1.6 TDI'],
        ['VI', 2017, 0, '1.0, 1.0 TSI, 1.5 TSI@2017-2021, 2.0 TSI, 1.6 TDI@2017-2021'],
        ['Sedan', 2010, 2020, '1.6, 1.4 TSI@2015-'],
        ['Liftback', 2020, 2022, '1.6, 1.4 TSI']
      ]],
      ['Passat', 'пассат|пасат|passat|сс|цц|cc', [
        ['B3', 1988, 1993, '1.6, 1.8, 2.0, 2.8 VR6@1991-, 1.6 D, 1.6 TD'],
        ['B4', 1993, 1997, '1.6, 1.8, 2.0, 2.8 VR6, 1.9 D, 1.9 TD, 1.9 TDI'],
        ['B5', 1996, 2000, '1.6, 1.8, 1.8 T, 2.3 V5, 2.8 V6, 1.9 TDI, 2.5 TDI'],
        ['B5+', 2000, 2005, '1.6, 1.8 T, 2.0, 2.3 V5, 2.8 V6, 4.0 W8@2001-2004, 1.9 TDI, 2.0 TDI@2003-, 2.5 TDI'],
        ['B6', 2005, 2010, '1.6, 1.6 FSI, 1.8 TSI@2007-, 2.0, 2.0 FSI, 2.0 TSI, 3.2 VR6, 3.6 VR6@2008-, 1.9 TDI, 2.0 TDI'],
        ['B7', 2010, 2015, '1.4 TSI, 1.8 TSI, 2.0 TSI, 3.6 VR6, 1.6 TDI, 2.0 TDI'],
        ['B8', 2014, 2023, '1.4 TSI@2014-2019, 1.5 TSI@2019-, 1.8 TSI@2015-2019, 2.0 TSI, 1.4 TSI GTE@2015-, 1.6 TDI@2014-2020, 2.0 TDI'],
        ['B9', 2024, 0, '1.5 eTSI, 2.0 TSI, 1.5 eHybrid, 2.0 TDI'],
        ['NMS (США)', 2011, 2022, '2.5@2011-2014, 1.8 TSI@2013-2017, 2.0 TSI@2018-, 3.6 VR6@2011-2018, 2.0 TDI@2012-2015'],
        ['CC', 2008, 2016, '1.8 TSI, 2.0 TSI, 3.6 VR6, 2.0 TDI']
      ]],
      ['Arteon', 'артеон|arteon', [
        ['', 2017, 2024, '1.5 TSI@2018-, 2.0 TSI, 1.4 eHybrid@2020-, 2.0 TDI']
      ]],
      ['Jetta', 'джетта|джета|jetta', [
        ['V', 2005, 2010, '1.4 TSI@2007-, 1.6, 1.6 FSI, 2.0 FSI, 2.0 TSI, 2.5, 1.9 TDI, 2.0 TDI'],
        ['VI', 2010, 2018, '1.2 TSI, 1.4 TSI, 1.6, 2.0, 2.5@2011-2014, 1.8 TSI@2014-, 2.0 TSI, 1.4 TSI Hybrid@2013-2016, 1.6 TDI, 2.0 TDI'],
        ['VII', 2018, 0, '1.4 TSI@2018-2021, 1.5 TSI@2021-, 1.6@2020-2022, 2.0 TSI']
      ]],
      ['Bora', 'бора|bora', [
        ['', 1998, 2005, '1.4, 1.6, 1.8, 1.8 T, 2.0, 2.3 V5, 2.8 V6, 1.9 SDI, 1.9 TDI']
      ]],
      ['Vento', 'венто|vento', [
        ['', 1992, 1998, '1.6, 1.8, 2.0, 2.8 VR6, 1.9 D, 1.9 TD, 1.9 TDI']
      ]],
      ['Tiguan', 'тигуан|тигуан|тигуанъ|tiguan', [
        ['I', 2007, 2016, '1.4 TSI, 2.0 TSI, 2.0 TDI'],
        ['II', 2016, 2024, '1.4 TSI@2016-2020, 1.5 TSI@2018-, 2.0 TSI, 1.4 eHybrid@2020-, 2.0 TDI'],
        ['III', 2024, 0, '1.5 eTSI, 2.0 TSI, 1.5 eHybrid, 2.0 TDI']
      ]],
      ['Touareg', 'туарег|туарэг|touareg', [
        ['I', 2002, 2010, '3.2 VR6@2002-2006, 3.6 VR6@2006-, 4.2 V8, 6.0 W12@2005-2009, 2.5 TDI, 3.0 TDI@2004-, 5.0 TDI'],
        ['II', 2010, 2018, '3.6 VR6, 3.0 TSI Hybrid@2010-2014, 3.0 TDI, 4.2 TDI'],
        ['III', 2018, 0, '3.0 TSI, 3.0 TSI eHybrid@2020-, 3.0 TDI, 4.0 TDI@2019-2020']
      ]],
      ['Touran', 'туран|touran', [
        ['I', 2003, 2015, '1.2 TSI@2010-, 1.4 TSI@2006-, 1.6, 1.6 FSI, 2.0 FSI@2003-2006, 1.6 TDI@2010-, 1.9 TDI@2003-2010, 2.0 TDI'],
        ['II', 2015, 2025, '1.2 TSI@2015-2018, 1.4 TSI@2015-2018, 1.5 TSI@2018-, 1.6 TDI, 2.0 TDI']
      ]],
      ['Sharan', 'шаран|sharan', [
        ['I', 1995, 2010, '2.0, 1.8 T, 2.8 VR6, 1.9 TDI, 2.0 TDI@2005-'],
        ['II', 2010, 2022, '1.4 TSI, 2.0 TSI, 2.0 TDI']
      ]],
      ['Caddy', 'кадди|кади|caddy', [
        ['II', 1995, 2004, '1.4, 1.6, 1.9 SDI, 1.9 TDI'],
        ['III', 2003, 2015, '1.2 TSI@2010-, 1.4@2004-2010, 1.6, 1.6 TDI@2010-, 1.9 TDI@2004-2010, 2.0 SDI@2004-2010, 2.0 TDI'],
        ['IV', 2015, 2020, '1.0 TSI, 1.2 TSI, 1.4 TSI, 2.0 TDI'],
        ['V', 2020, 0, '1.5 TSI, 2.0 TDI']
      ]],
      ['Transporter / Multivan', 'транспортер|транспортёр|мультивен|мультиван|каравелла|каравела|калифорния|transporter|multivan|caravelle|california|t4|t5|t6|т4|т5|т6', [
        ['T4', 1990, 2003, '2.0, 2.5, 2.8 VR6@1996-, 1.9 D, 1.9 TD, 2.4 D, 2.5 TDI'],
        ['T5', 2003, 2015, '2.0, 3.2 V6@2003-2009, 2.0 TSI@2010-, 1.9 TDI@2003-2009, 2.5 TDI@2003-2009, 2.0 TDI@2009-'],
        ['T6', 2015, 2024, '2.0 TSI, 2.0 TDI'],
        ['T7', 2021, 0, '1.5 TSI, 2.0 TSI, 1.4 eHybrid, 2.0 TDI@2022-']
      ]],
      ['Crafter', 'крафтер|crafter', [
        ['I', 2006, 2016, '2.5 TDI@2006-2011, 2.0 TDI@2011-'],
        ['II', 2016, 0, '2.0 TDI']
      ]],
      ['Amarok', 'амарок|amarok', [
        ['I', 2010, 2022, '2.0 TDI, 3.0 TDI@2016-'],
        ['II', 2022, 0, '2.0 TDI, 3.0 TDI']
      ]],
      ['Scirocco', 'сирокко|шиpокко|широкко|scirocco', [
        ['III', 2008, 2017, '1.4 TSI, 2.0 TSI, 2.0 TDI']
      ]],
      ['Beetle', 'битл|жук|new beetle|нью битл|beetle', [
        ['New Beetle', 1997, 2010, '1.4, 1.6, 1.8 T, 2.0, 2.3 V5, 2.5@2006-, 1.9 TDI'],
        ['II', 2011, 2019, '1.2 TSI, 1.4 TSI, 1.8 TSI@2014-, 2.0 TSI, 2.5@2012-2014, 1.6 TDI, 2.0 TDI']
      ]],
      ['up!', 'ап|апп|up', [
        ['', 2011, 2023, '1.0, 1.0 TSI@2016-, EV@2013-']
      ]],
      ['Lupo', 'лупо|lupo', [
        ['', 1998, 2005, '1.0, 1.4, 1.6, 1.2 TDI, 1.4 TDI, 1.7 SDI']
      ]],
      ['Fox', 'фокс|fox', [
        ['', 2005, 2011, '1.2, 1.4, 1.4 TDI']
      ]],
      ['Eos', 'эос|еос|eos', [
        ['', 2006, 2015, '1.4 TSI@2008-, 1.6 FSI@2006-2007, 2.0 FSI@2006-2008, 2.0 TSI, 3.2 VR6@2006-2010, 2.0 TDI']
      ]],
      ['Phaeton', 'фаэтон|фаетон|phaeton', [
        ['', 2002, 2016, '3.2 VR6@2002-2008, 3.6 VR6@2008-, 4.2 V8, 6.0 W12, 3.0 TDI@2004-, 5.0 TDI@2003-2006']
      ]],
      ['Teramont / Atlas', 'терамонт|атлас|teramont|atlas', [
        ['I', 2017, 2023, '2.0 TSI, 3.6 VR6'],
        ['II', 2024, 0, '2.0 TSI']
      ]],
      ['T-Roc', 'т-рок|трок|т рок|t-roc|troc', [
        ['', 2017, 0, '1.0 TSI, 1.5 TSI, 2.0 TSI, 1.6 TDI@2017-2020, 2.0 TDI']
      ]],
      ['T-Cross', 'т-кросс|ткросс|т кросс|t-cross|tcross', [
        ['', 2019, 0, '1.0 TSI, 1.5 TSI, 1.6 TDI@2019-2020']
      ]],
      ['Taos', 'таос|taos', [
        ['', 2021, 0, '1.4 TSI@2021-2024, 1.5 TSI@2022-, 1.6@2021-2022']
      ]],
      ['Taigo', 'тайго|taigo', [
        ['', 2021, 0, '1.0 TSI, 1.5 TSI']
      ]],
      ['ID.3', 'айди 3|ид 3|id3|id.3', [['', 2020, 0, 'EV']]],
      ['ID.4', 'айди 4|ид 4|id4|id.4|crozz|кроз', [['', 2020, 0, 'EV']]],
      ['ID.6', 'айди 6|ид 6|id6|id.6', [['', 2021, 0, 'EV']]],
      ['ID. Buzz', 'айди базз|ид базз|buzz|базз', [['', 2022, 0, 'EV']]]
    ],

    audi: [
      ['80', 'ауди 80|бочка|80', [
        ['B3', 1986, 1991, '1.6, 1.8, 2.0, 1.6 D, 1.6 TD'],
        ['B4', 1991, 1995, '1.6, 2.0, 2.3, 2.6 V6, 2.8 V6, 1.9 TDI']
      ]],
      ['100', 'ауди 100|сотка|100', [
        ['C4', 1990, 1994, '2.0, 2.3, 2.6 V6, 2.8 V6, 2.4 D, 2.5 TDI']
      ]],
      ['A1', 'а1|a1', [
        ['8X', 2010, 2018, '1.0 TFSI@2015-, 1.2 TFSI@2010-2015, 1.4 TFSI, 1.6 TDI'],
        ['GB', 2018, 0, '1.0 TFSI, 1.5 TFSI, 2.0 TFSI']
      ]],
      ['A3', 'а3|a3', [
        ['8L', 1996, 2003, '1.6, 1.8, 1.8 T, 1.9 TDI'],
        ['8P', 2003, 2012, '1.2 TFSI@2010-, 1.4 TFSI@2007-, 1.6, 1.6 FSI, 1.8 TFSI@2007-, 2.0 FSI, 2.0 TFSI, 3.2 V6, 1.6 TDI@2009-, 1.9 TDI, 2.0 TDI'],
        ['8V', 2012, 2020, '1.0 TFSI@2016-, 1.2 TFSI@2012-2016, 1.4 TFSI, 1.5 TFSI@2017-, 1.8 TFSI, 2.0 TFSI, 1.4 TFSI e-tron@2014-, 1.6 TDI, 2.0 TDI'],
        ['8Y', 2020, 0, '1.0 TFSI, 1.5 TFSI, 2.0 TFSI, 1.4 TFSI e@2020-2024, 1.5 TFSI e@2024-, 2.0 TDI']
      ]],
      ['A4', 'а4|a4|allroad|олроуд|олроад', [
        ['B5', 1994, 2001, '1.6, 1.8, 1.8 T, 2.4 V6@1997-, 2.6 V6@1995-1997, 2.8 V6, 1.9 TDI, 2.5 TDI@1997-'],
        ['B6', 2000, 2004, '1.6, 1.8 T, 2.0, 2.0 FSI@2002-, 2.4 V6, 3.0 V6, 1.9 TDI, 2.5 TDI'],
        ['B7', 2004, 2008, '1.6, 1.8 T, 2.0, 2.0 TFSI, 3.2 FSI, 1.9 TDI, 2.0 TDI, 2.7 TDI, 3.0 TDI'],
        ['B8', 2007, 2015, '1.8 TFSI, 2.0 TFSI, 3.2 FSI@2007-2011, 2.0 TDI, 2.7 TDI@2007-2011, 3.0 TDI'],
        ['B9', 2015, 2024, '1.4 TFSI@2015-2018, 2.0 TFSI, 2.0 TDI, 3.0 TDI']
      ]],
      ['A5', 'а5|a5', [
        ['8T', 2007, 2016, '1.8 TFSI, 2.0 TFSI, 3.2 FSI@2007-2011, 2.0 TDI, 2.7 TDI@2007-2011, 3.0 TDI'],
        ['F5', 2016, 2024, '1.4 TFSI@2016-2018, 2.0 TFSI, 2.0 TDI, 3.0 TDI'],
        ['B10', 2024, 0, '2.0 TFSI, 2.0 TDI']
      ]],
      ['A6', 'а6|a6|allroad|олроуд|олроад', [
        ['C4', 1994, 1997, '1.8@1995-, 2.0, 2.6 V6, 2.8 V6, 1.9 TDI, 2.5 TDI'],
        ['C5', 1997, 2004, '1.8, 1.8 T, 2.0@2001-, 2.4 V6, 2.7 V6 Biturbo, 2.8 V6, 3.0 V6@2001-, 4.2 V8, 1.9 TDI, 2.5 TDI'],
        ['C6', 2004, 2011, '2.0 TFSI, 2.4 V6, 2.8 FSI@2008-, 3.0 TFSI@2008-, 3.2 FSI, 4.2 V8, 2.0 TDI, 2.7 TDI, 3.0 TDI'],
        ['C7', 2011, 2018, '1.8 TFSI@2014-, 2.0 TFSI, 2.8 FSI, 3.0 TFSI, 2.0 TFSI Hybrid@2012-2014, 2.0 TDI, 3.0 TDI'],
        ['C8', 2018, 0, '2.0 TFSI, 3.0 TFSI, 2.0 TFSI e@2019-, 2.0 TDI, 3.0 TDI']
      ]],
      ['A7', 'а7|a7', [
        ['4G', 2010, 2018, '2.8 FSI, 3.0 TFSI, 3.0 TDI'],
        ['4K', 2018, 0, '2.0 TFSI, 3.0 TFSI, 2.0 TFSI e@2019-, 2.0 TDI, 3.0 TDI']
      ]],
      ['A8', 'а8|a8', [
        ['D2', 1994, 2002, '2.8 V6, 3.7 V8, 4.2 V8, 6.0 W12@2001-, 2.5 TDI, 3.3 TDI@2000-'],
        ['D3', 2002, 2010, '2.8 FSI@2007-, 3.0 V6, 3.2 FSI, 3.7 V8, 4.2 V8, 6.0 W12, 3.0 TDI, 4.0 TDI, 4.2 TDI'],
        ['D4', 2010, 2017, '3.0 TFSI, 4.0 TFSI@2012-, 4.2 FSI, 6.3 W12, 2.0 TFSI Hybrid@2012-2014, 3.0 TDI, 4.2 TDI'],
        ['D5', 2017, 0, '3.0 TFSI, 4.0 TFSI, 3.0 TFSI e@2019-, 3.0 TDI']
      ]],
      ['Q2', 'ку2|к2|q2', [
        ['', 2016, 0, '1.0 TFSI, 1.4 TFSI@2016-2018, 1.5 TFSI@2018-, 2.0 TFSI, 1.6 TDI, 2.0 TDI']
      ]],
      ['Q3', 'ку3|к3|q3', [
        ['8U', 2011, 2018, '1.4 TFSI, 2.0 TFSI, 2.0 TDI'],
        ['F3', 2018, 0, '1.5 TFSI, 2.0 TFSI, 1.4 TFSI e@2021-, 2.0 TDI']
      ]],
      ['Q5', 'ку5|к5|q5', [
        ['8R', 2008, 2017, '2.0 TFSI, 3.2 FSI@2008-2012, 3.0 TFSI@2012-, 2.0 TFSI Hybrid@2011-2016, 2.0 TDI, 3.0 TDI'],
        ['FY', 2017, 2024, '2.0 TFSI, 2.0 TFSI e@2019-, 2.0 TDI, 3.0 TDI'],
        ['GU', 2024, 0, '2.0 TFSI, 2.0 TDI']
      ]],
      ['Q7', 'ку7|к7|q7', [
        ['4L', 2005, 2015, '3.0 TFSI@2010-, 3.6 FSI, 4.2 FSI, 3.0 TDI, 4.2 TDI, 6.0 TDI@2008-2012'],
        ['4M', 2015, 0, '2.0 TFSI, 3.0 TFSI, 3.0 TFSI e@2019-, 3.0 TDI']
      ]],
      ['Q8', 'ку8|к8|q8', [
        ['', 2018, 0, '3.0 TFSI, 3.0 TFSI e@2019-, 3.0 TDI']
      ]],
      ['TT', 'тт|tt', [
        ['8N', 1998, 2006, '1.8 T, 3.2 V6@2003-'],
        ['8J', 2006, 2014, '1.8 TFSI@2008-, 2.0 TFSI, 3.2 V6@2006-2010, 2.0 TDI@2008-'],
        ['8S', 2014, 2023, '1.8 TFSI@2015-2018, 2.0 TFSI, 2.0 TDI@2014-2018']
      ]],
      ['e-tron / Q8 e-tron', 'етрон|этрон|е-трон|e-tron|etron', [['', 2018, 2025, 'EV']]],
      ['Q4 e-tron', 'ку4|к4|q4|q4 etron', [['', 2021, 0, 'EV']]]
    ],

    skoda: [
      ['Felicia', 'фелиция|felicia', [
        ['', 1994, 2001, '1.3, 1.6, 1.9 D']
      ]],
      ['Fabia', 'фабия|фабиа|fabia', [
        ['I', 1999, 2007, '1.0, 1.2, 1.4, 2.0, 1.4 TDI, 1.9 SDI, 1.9 TDI'],
        ['II', 2007, 2014, '1.2, 1.2 TSI@2010-, 1.4, 1.4 TSI@2010-, 1.6, 1.2 TDI@2010-, 1.4 TDI@2007-2010, 1.6 TDI@2010-, 1.9 TDI@2007-2010'],
        ['III', 2014, 2021, '1.0, 1.0 TSI, 1.2 TSI@2014-2017, 1.4 TDI@2014-2018'],
        ['IV', 2021, 0, '1.0, 1.0 TSI, 1.5 TSI']
      ]],
      ['Octavia', 'октавия|октавиа|актавия|octavia', [
        ['Tour', 1996, 2010, '1.4, 1.6, 1.8 T, 2.0, 1.9 SDI, 1.9 TDI'],
        ['A5', 2004, 2013, '1.2 TSI@2010-, 1.4, 1.4 TSI@2008-, 1.6, 1.6 FSI@2004-2008, 1.8 TSI@2008-, 2.0 FSI@2004-2008, 2.0 TSI, 1.6 TDI@2009-, 1.9 TDI@2004-2010, 2.0 TDI'],
        ['A7', 2013, 2020, '1.0 TSI@2017-, 1.2 TSI@2013-2018, 1.4 TSI, 1.5 TSI@2018-, 1.6, 1.8 TSI, 2.0 TSI, 1.6 TDI, 2.0 TDI'],
        ['A8', 2020, 0, '1.0 TSI, 1.4 TSI@2020-2022, 1.5 TSI, 1.6@2020-2022, 2.0 TSI, 1.4 TSI iV@2020-, 2.0 TDI']
      ]],
      ['Rapid', 'рапид|rapid', [
        ['I', 2012, 2020, '1.0 TSI@2017-, 1.2, 1.2 TSI@2012-2017, 1.4 TSI, 1.6, 1.6 TDI'],
        ['II', 2020, 2022, '1.6, 1.4 TSI']
      ]],
      ['Superb', 'суперб|суберб|superb', [
        ['I', 2001, 2008, '1.8 T, 2.0, 2.8 V6, 1.9 TDI, 2.0 TDI@2005-, 2.5 TDI'],
        ['II', 2008, 2015, '1.4 TSI, 1.8 TSI, 3.6 V6, 1.6 TDI@2009-, 1.9 TDI@2008-2010, 2.0 TDI'],
        ['III', 2015, 2024, '1.4 TSI@2015-2019, 1.5 TSI@2018-, 1.8 TSI@2015-2019, 2.0 TSI, 1.4 TSI iV@2019-, 1.6 TDI@2015-2019, 2.0 TDI'],
        ['IV', 2024, 0, '1.5 TSI, 2.0 TSI, 1.5 TSI iV, 2.0 TDI']
      ]],
      ['Roomster', 'румстер|roomster', [
        ['', 2006, 2015, '1.2, 1.2 TSI@2010-, 1.4, 1.6, 1.4 TDI@2006-2010, 1.2 TDI@2010-, 1.6 TDI@2010-, 1.9 TDI@2006-2010']
      ]],
      ['Yeti', 'йети|ети|yeti', [
        ['', 2009, 2018, '1.2 TSI, 1.4 TSI, 1.6, 1.8 TSI, 1.6 TDI, 2.0 TDI']
      ]],
      ['Kodiaq', 'кодиак|кодияк|kodiaq', [
        ['I', 2016, 2024, '1.4 TSI, 1.5 TSI@2018-, 2.0 TSI, 2.0 TDI'],
        ['II', 2024, 0, '1.5 TSI, 2.0 TSI, 1.5 TSI iV, 2.0 TDI']
      ]],
      ['Karoq', 'карок|karoq', [
        ['', 2017, 0, '1.0 TSI, 1.4 TSI, 1.5 TSI@2018-, 1.6@2020-2022, 1.6 TDI@2017-2020, 2.0 TDI']
      ]],
      ['Kamiq', 'камик|kamiq', [
        ['', 2019, 0, '1.0 TSI, 1.5 TSI, 1.6 TDI@2019-2020']
      ]],
      ['Scala', 'скала|scala', [
        ['', 2019, 0, '1.0 TSI, 1.5 TSI, 1.6 TDI@2019-2020']
      ]],
      ['Enyaq', 'эньяк|еньяк|эниак|enyaq', [['', 2020, 0, 'EV']]]
    ],

    seat: [
      ['Ibiza', 'ибица|ибиза|ibiza', [
        ['6K', 1993, 2002, '1.0, 1.4, 1.6, 1.8, 2.0, 1.9 D, 1.9 SDI, 1.9 TDI'],
        ['6L', 2002, 2008, '1.2, 1.4, 1.6, 1.8 T, 1.4 TDI, 1.9 SDI, 1.9 TDI'],
        ['6J', 2008, 2017, '1.0@2015-, 1.0 TSI@2015-, 1.2, 1.2 TSI@2010-, 1.4, 1.4 TSI, 1.2 TDI@2010-2015, 1.4 TDI@2015-, 1.6 TDI@2009-, 1.9 TDI@2008-2010'],
        ['KJ', 2017, 0, '1.0, 1.0 TSI, 1.5 TSI, 1.6 TDI@2017-2021']
      ]],
      ['Cordoba', 'кордоба|cordoba', [
        ['6K', 1993, 2002, '1.4, 1.6, 1.8, 2.0, 1.9 D, 1.9 SDI, 1.9 TDI'],
        ['6L', 2002, 2009, '1.2, 1.4, 1.6, 1.4 TDI, 1.9 SDI, 1.9 TDI']
      ]],
      ['Leon', 'леон|leon|cupra|купра', [
        ['1M', 1999, 2005, '1.4, 1.6, 1.8, 1.8 T, 1.9 TDI'],
        ['1P', 2005, 2012, '1.2 TSI@2010-, 1.4, 1.4 TSI, 1.6, 1.8 TSI, 2.0 FSI@2005-2008, 2.0 TFSI, 1.6 TDI@2010-, 1.9 TDI@2005-2010, 2.0 TDI'],
        ['5F', 2012, 2020, '1.0 TSI@2015-, 1.2 TSI@2012-2018, 1.4 TSI, 1.5 TSI@2018-, 1.8 TSI, 2.0 TSI, 1.6 TDI, 2.0 TDI'],
        ['KL', 2020, 0, '1.0 TSI, 1.5 TSI, 2.0 TSI, 1.4 eHybrid@2020-2024, 1.5 eHybrid@2024-, 2.0 TDI']
      ]],
      ['Toledo', 'толедо|toledo', [
        ['1L', 1991, 1998, '1.6, 1.8, 2.0, 1.9 D, 1.9 TD, 1.9 TDI'],
        ['1M', 1998, 2004, '1.6, 1.8, 1.8 T, 2.3 V5, 1.9 TDI'],
        ['5P', 2004, 2009, '1.6, 2.0 FSI, 2.0 TFSI, 1.9 TDI, 2.0 TDI'],
        ['NH', 2012, 2019, '1.0 TSI@2015-, 1.2, 1.2 TSI, 1.4 TSI, 1.6 TDI']
      ]],
      ['Altea', 'альтеа|алтея|altea', [
        ['', 2004, 2015, '1.2 TSI@2010-, 1.4, 1.4 TSI, 1.6, 1.8 TSI, 2.0 FSI@2004-2008, 2.0 TFSI, 1.6 TDI@2010-, 1.9 TDI@2004-2010, 2.0 TDI']
      ]],
      ['Alhambra', 'альхамбра|алхамбра|alhambra', [
        ['I', 1996, 2010, '2.0, 1.8 T, 2.8 V6, 1.9 TDI, 2.0 TDI@2005-'],
        ['II', 2010, 2020, '1.4 TSI, 2.0 TSI, 2.0 TDI']
      ]],
      ['Ateca', 'атека|ateca', [
        ['', 2016, 0, '1.0 TSI, 1.4 TSI@2016-2018, 1.5 TSI@2018-, 2.0 TSI, 1.6 TDI@2016-2020, 2.0 TDI']
      ]],
      ['Arona', 'арона|arona', [
        ['', 2017, 0, '1.0 TSI, 1.5 TSI, 1.6 TDI@2017-2021']
      ]],
      ['Tarraco', 'таррако|тарако|tarraco', [
        ['', 2018, 0, '1.5 TSI, 2.0 TSI, 1.4 eHybrid@2021-, 2.0 TDI']
      ]]
    ],

    porsche: [
      ['Cayenne', 'каен|кайен|каенн|cayenne', [
        ['955/957', 2002, 2010, '3.2 V6@2003-2007, 3.6 V6@2007-, 4.5 V8@2002-2007, 4.8 V8@2007-, 3.0 TDI@2009-'],
        ['958', 2010, 2017, '3.6 V6, 3.0 V6 Hybrid, 4.8 V8, 3.0 TDI, 4.2 TDI@2013-'],
        ['9Y0', 2017, 0, '3.0 V6, 2.9 V6, 4.0 V8, 3.0 V6 E-Hybrid@2018-']
      ]],
      ['Macan', 'макан|macan', [
        ['95B', 2014, 0, '2.0@2016-, 3.0 V6@2014-2018, 3.6 V6@2014-2018, 2.9 V6@2019-, 3.0 TDI@2014-2018'],
        ['Electric', 2024, 0, 'EV']
      ]],
      ['Panamera', 'панамера|panamera', [
        ['970', 2009, 2016, '3.6 V6, 3.0 V6@2013-, 4.8 V8, 3.0 V6 Hybrid@2011-, 3.0 TDI@2011-'],
        ['971', 2016, 0, '2.9 V6, 4.0 V8, 2.9 V6 E-Hybrid, 4.0 TDI@2016-2018']
      ]],
      ['911', '911|каррера|carrera', [
        ['996', 1997, 2005, '3.4, 3.6'],
        ['997', 2004, 2012, '3.6, 3.8'],
        ['991', 2011, 2019, '3.4@2011-2015, 3.8, 3.0@2015-'],
        ['992', 2019, 0, '3.0, 3.7']
      ]],
      ['718 Boxster / Cayman', 'бокстер|кайман|boxster|cayman|718', [
        ['', 2016, 0, '2.0, 2.5, 4.0@2019-']
      ]],
      ['Taycan', 'тайкан|taycan', [['', 2019, 0, 'EV']]]
    ],

    bentley: [
      ['Continental GT', 'континенталь|континентал|continental|gt', [
        ['I', 2003, 2011, '6.0 W12'],
        ['II', 2011, 2018, '4.0 V8@2012-, 6.0 W12'],
        ['III', 2018, 2024, '4.0 V8, 6.0 W12'],
        ['IV', 2024, 0, '4.0 V8 Hybrid']
      ]],
      ['Flying Spur', 'флаинг спур|флайинг спур|flying spur|spur', [
        ['I', 2005, 2013, '6.0 W12'],
        ['II', 2013, 2019, '4.0 V8@2014-, 6.0 W12'],
        ['III', 2019, 0, '2.9 V6 Hybrid@2021-, 4.0 V8, 6.0 W12@2019-2024']
      ]],
      ['Bentayga', 'бентайга|бентейга|bentayga', [
        ['', 2015, 0, '4.0 V8@2018-, 6.0 W12@2015-2024, 4.0 TDI@2016-2018, 3.0 V6 Hybrid@2019-']
      ]]
    ]
  };
  var MAKE_NAMES = { vw: 'Volkswagen', audi: 'Audi', skoda: 'Škoda', seat: 'SEAT', porsche: 'Porsche', bentley: 'Bentley' };

  var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  var L = function (ru, en) { return EN ? en : ru; };

  /* ── Normalised search ── */
  var TR = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
  var norm = function (s) { return String(s).toLowerCase().replace(/ё/g, 'е').replace(/[\s\-.\/!]+/g, ''); };
  var translit = function (s) { return norm(s).replace(/[а-я]/g, function (c) { return TR[c] || c; }); };

  // flat model list with search keys
  var MODELS = [];
  Object.keys(CARS).forEach(function (mk) {
    CARS[mk].forEach(function (m) {
      var gens = m[2].map(function (g) {
        var to = g[2] || NOW;
        var engines = g[3].split(/\s*,\s*/).map(function (e) {
          var p = e.split('@'), y = (p[1] || '').split('-');
          return { name: p[0], from: +y[0] || g[1], to: y[1] ? +y[1] : to };
        });
        return { label: g[0], from: g[1], to: to, now: !g[2], engines: engines };
      });
      var keys = [m[0]].concat(m[1].split('|'));
      MODELS.push({
        make: mk, name: m[0], gens: gens,
        keys: keys.map(norm).concat(keys.map(translit)).filter(function (k, i, a) { return k && a.indexOf(k) === i; }),
        genKeys: gens.map(function (g) { return [norm(g.label), translit(g.label)]; })
      });
    });
  });

  var fuel = function (e) {
    if (e === 'EV') return L('электро', 'electric');
    if (/GTE|eHybrid|Hybrid|TFSI e\b|e-tron|\biV\b/.test(e)) return L('гибрид', 'hybrid');
    if (/TDI|SDI|\bD\b|\bTD\b/.test(e)) return L('дизель', 'diesel');
    return L('бензин', 'petrol');
  };
  var engName = function (e) { return e === 'EV' ? L('Электро', 'Electric') : e; };
  var genName = function (m, g) {
    if (!g || !g.label) return m.name;
    if (/США/.test(g.label)) return m.name + ' ' + L(g.label, g.label.replace('США', 'USA'));
    return m.name + ' ' + g.label;
  };

  // search: "пассат", "passat b8", "гольф 7", "а6 с7" (Cyrillic look-alikes in the generation part are mapped too)
  var LOOK = { а: 'a', в: 'b', с: 'c', е: 'e', к: 'k', м: 'm', н: 'h', о: 'o', р: 'p', т: 't', х: 'x', у: 'y' };
  var lookAlike = function (s) { return norm(s).replace(/[а-я]/g, function (c) { return LOOK[c] || c; }); };
  var search = function (q, makes, cur) {
    var words = String(q).trim().toLowerCase().split(/\s+/).filter(Boolean);
    var out = [];
    MODELS.forEach(function (m) {
      if (makes.indexOf(m.make) === -1) return;
      if (!words.length) { if (!cur || m.make === cur) out.push({ m: m, score: 0 }); return; }
      // try the longest prefix of the query as the model, the rest as the generation
      for (var n = words.length; n >= 1; n--) {
        var mq = norm(words.slice(0, n).join(' ')), tq = translit(words.slice(0, n).join(' '));
        var score = -1;
        m.keys.forEach(function (k) {
          if (k === mq || k === tq) score = Math.max(score, 3);
          else if (k.indexOf(mq) === 0 || k.indexOf(tq) === 0) score = Math.max(score, 2);
          else if (mq.length > 2 && k.indexOf(mq) > 0) score = Math.max(score, 1);
        });
        if (score < 0) continue;
        var rest = words.slice(n).join(' ');
        if (!rest) { out.push({ m: m, score: score + (m.make === cur ? 0.5 : 0) }); return; }
        var r1 = norm(rest), r2 = lookAlike(rest);
        if (/^(19|20)\d\d$/.test(rest)) {
          if (m.gens.some(function (g) { return +rest >= g.from && +rest <= g.to; })) out.push({ m: m, score: score + 1 + (m.make === cur ? 0.5 : 0), year: +rest });
          return;
        }
        m.gens.forEach(function (g, gi) {
          var gk = m.genKeys[gi];
          if (g.label && (gk[0] === r1 || gk[0] === r2 || gk[1] === r1 || gk[0].indexOf(r1) === 0 || gk[0].indexOf(r2) === 0)) {
            out.push({ m: m, g: g, score: score + 1 + (m.make === cur ? 0.5 : 0) });
          }
        });
        return;
      }
    });
    out.sort(function (a, b) { return b.score - a.score || a.m.name.localeCompare(b.m.name, 'en', { numeric: true }); });
    return out.slice(0, 40);
  };

  /* ── Styles: sizes and colours come from the site's own input, so every version and theme matches ── */
  var css = document.createElement('style');
  css.textContent = [
    '.carpick{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,.8fr) minmax(0,1.3fr);gap:6px;position:relative;width:100%}',
    '.carpick__f{position:relative;min-width:0}',
    '.carpick__f>input{width:100%;padding-right:34px;text-overflow:ellipsis;cursor:pointer}',
    '.carpick__f>input[readonly]{caret-color:transparent}',
    '.carpick__f>input:disabled{opacity:.45;cursor:not-allowed}',
    '.carpick__f::after{content:"";position:absolute;right:14px;top:50%;width:7px;height:7px;border:solid currentColor;border-width:0 1.5px 1.5px 0;transform:translateY(-70%) rotate(45deg);opacity:.55;pointer-events:none}',
    '.carpick__list{position:fixed;z-index:1000;max-height:min(320px,46vh);overflow:auto;overscroll-behavior:contain;margin:0;padding:4px;list-style:none;border:1px solid var(--cp-bd,#888);border-radius:var(--cp-r,5px);background:var(--cp-bg,#fff);color:var(--cp-fg,#111);box-shadow:0 18px 40px rgba(0,0,0,.28)}',
    '.carpick__list[hidden]{display:none}',
    '.carpick__list li{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:10px 12px;border-radius:calc(var(--cp-r,5px) - 1px);cursor:pointer;line-height:1.25}',
    '.carpick__list li small{opacity:.6;font-size:.8em;white-space:nowrap}',
    '.carpick__list li.is-act{background:var(--cp-hi,rgba(127,127,127,.16))}',
    '.carpick__list li[aria-selected="true"]{font-weight:600}',
    '.carpick__list li.carpick__grp{cursor:default;padding:10px 12px 4px;font-size:.72em;letter-spacing:.08em;text-transform:uppercase;opacity:.6}',
    '.carpick__list li.carpick__free{opacity:.8;font-style:italic}',
    '.carpick__mk{font-size:.75em;opacity:.6;margin-left:6px}',
    '@media (max-width:620px){.carpick{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.carpick__f--model{grid-column:1/-1}}',
    '.carpick--narrow{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.carpick--narrow .carpick__f--model{grid-column:1/-1}'
  ].join('');
  document.head.appendChild(css);

  /* ── One picker per field ── */
  var uid = 0;
  var enhance = function (input) {
    if (input.dataset.carpick) return;
    input.dataset.carpick = '1';
    var form = input.form;
    var inCalc = !!input.closest('[data-check]');
    var allowed = inCalc ? ['vw', 'audi', 'skoda'] : Object.keys(CARS);
    var curMake = function () {
      var r = inCalc ? document.querySelector('input[name="calc-make"]:checked') : form && form.querySelector('input[name="make"]:checked');
      if (!r) return null;
      return inCalc ? r.value : r.getAttribute('data-make-id');
    };
    var id = 'cp' + (++uid);

    var hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = 'model';
    input.removeAttribute('name');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', id + '-list');
    input.placeholder = L('Модель: Passat, Октавия, A6…', 'Model: Passat, Octavia, A6…');

    var wrap = document.createElement('div');
    wrap.className = 'carpick';
    var cell = function (cls) { var d = document.createElement('div'); d.className = 'carpick__f ' + cls; return d; };
    var fModel = cell('carpick__f--model'), fYear = cell('carpick__f--year'), fEng = cell('carpick__f--eng');
    input.parentNode.insertBefore(wrap, input);
    fModel.appendChild(input);
    var mkSelect = function (ph, label) {
      var s = input.cloneNode(false);
      s.removeAttribute('id');
      s.removeAttribute('data-carpick');
      s.removeAttribute('aria-autocomplete');
      s.readOnly = true;
      s.disabled = true;
      s.value = '';
      s.placeholder = ph;
      s.setAttribute('aria-label', label);
      s.setAttribute('inputmode', 'none');
      return s;
    };
    var year = mkSelect(L('Год', 'Year'), L('Год выпуска', 'Year'));
    var eng = mkSelect(L('Двигатель', 'Engine'), L('Двигатель', 'Engine'));
    fYear.appendChild(year);
    fEng.appendChild(eng);
    wrap.appendChild(fModel); wrap.appendChild(fYear); wrap.appendChild(fEng);
    wrap.appendChild(hidden);
    var list = document.createElement('ul');
    list.className = 'carpick__list';
    list.id = id + '-list';
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    document.body.appendChild(list);
    [year, eng].forEach(function (s) { s.setAttribute('aria-controls', id + '-list'); });

    // narrow containers (the work-order panel): model on its own row
    var fit = function () { wrap.classList.toggle('carpick--narrow', wrap.getBoundingClientRect().width < 460); };
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(wrap); else fit();

    // in the booking row the picker takes the whole width
    var fld = wrap.parentElement;
    if (fld && fld.parentElement && /booking__row/.test(fld.parentElement.className)) fld.style.gridColumn = '1 / -1';

    var st = { m: null, g: null, y: 0, e: null, free: '' };

    var compose = function () {
      if (!st.m) { hidden.value = st.free; return; }
      var g = st.e ? st.e.g : st.g;
      if (!g && st.y) {
        var gs = st.m.gens.filter(function (x) { return st.y >= x.from && st.y <= x.to; });
        if (gs.length === 1) g = gs[0];
      }
      if (!g && st.m.gens.length === 1) g = st.m.gens[0];
      var s = genName(st.m, g);
      if (st.y) s += ' ' + st.y;
      if (st.e) s += ', ' + engName(st.e.name);
      hidden.value = s;
    };
    var paint = function () {
      input.value = st.m ? (st.g ? genName(st.m, st.g) : st.m.name) : st.free;
      year.disabled = !st.m;
      year.value = st.y ? String(st.y) : '';
      eng.disabled = !st.m || !st.y;
      eng.value = st.e ? engName(st.e.name) + (st.e.name === 'EV' ? '' : ' · ' + fuel(st.e.name)) : '';
      compose();
    };

    var years = function () {
      var ys = [];
      (st.g ? [st.g] : st.m.gens).forEach(function (g) {
        for (var y = g.to; y >= g.from; y--) {
          var hit = ys.filter(function (o) { return o.y === y; })[0];
          if (hit) hit.gens.push(g); else ys.push({ y: y, gens: [g] });
        }
      });
      return ys.sort(function (a, b) { return b.y - a.y; });
    };
    var engines = function () {
      var gs = (st.g ? [st.g] : st.m.gens).filter(function (g) { return st.y >= g.from && st.y <= g.to; });
      return gs.map(function (g) {
        return { g: g, list: g.engines.filter(function (e) { return st.y >= e.from && st.y <= e.to; }) };
      }).filter(function (x) { return x.list.length; });
    };

    /* list rendering */
    var owner = null, items = [], act = -1, placed = false;
    var theme = function () {
      var cs = getComputedStyle(owner);
      // the list needs a solid background: semi-transparent inputs (over a photo) fall back to a solid colour of the same tone
      var solid = function (c) { var a = /rgba\([^)]*,\s*([\d.]+)\)/.exec(c); return c && c !== 'transparent' && (!a || +a[1] > 0.92); };
      var bg = cs.backgroundColor;
      if (!solid(bg)) {
        var rgb = (cs.color.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number);
        bg = rgb[0] + rgb[1] + rgb[2] > 380 ? '#16191d' : '#ffffff';
      }
      list.style.setProperty('--cp-bg', bg);
      list.style.setProperty('--cp-fg', cs.color);
      list.style.setProperty('--cp-bd', cs.borderTopColor);
      list.style.setProperty('--cp-r', cs.borderTopLeftRadius);
      list.style.font = cs.font;
    };
    var place = function () {
      // fixed to the viewport, so sections with overflow:hidden do not cut it; opens upwards when there is no room below
      var o = owner.getBoundingClientRect();
      // not enough room below: bring the field to the middle of the screen first, so the list opens downwards
      if (!placed && innerHeight - o.bottom < Math.min(list.scrollHeight, 260)) { owner.scrollIntoView({ block: 'center' }); o = owner.getBoundingClientRect(); }
      placed = true;
      var w = wrap.getBoundingClientRect();
      var box = o.width < 220 ? w : o;
      list.style.left = box.left + 'px';
      list.style.width = box.width + 'px';
      var below = innerHeight - o.bottom - 8, above = o.top - 8;
      var h = Math.min(list.scrollHeight, 320, innerHeight * 0.46);
      if (below < Math.min(h, 180) && above > below) { list.style.top = 'auto'; list.style.bottom = (innerHeight - o.top + 4) + 'px'; list.style.maxHeight = Math.min(320, above) + 'px'; }
      else { list.style.bottom = 'auto'; list.style.top = (o.bottom + 4) + 'px'; list.style.maxHeight = Math.max(160, Math.min(320, below)) + 'px'; }
    };
    var open = function (el, rows) {
      owner = el;
      placed = false;
      items = [];
      act = -1;
      list.innerHTML = '';
      rows.forEach(function (r) {
        var li = document.createElement('li');
        if (r.group) { li.className = 'carpick__grp'; li.textContent = r.group; li.setAttribute('role', 'presentation'); list.appendChild(li); return; }
        li.id = id + '-o' + items.length;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(!!r.sel));
        if (r.cls) li.className = r.cls;
        li.innerHTML = r.html;
        li.addEventListener('mousedown', function (e) { e.preventDefault(); });
        li.addEventListener('click', function () { r.pick(); });
        list.appendChild(li);
        items.push({ li: li, pick: r.pick });
        if (r.sel && act < 0) act = items.length - 1;
      });
      [input, year, eng].forEach(function (x) { x.setAttribute('aria-expanded', String(x === el)); });
      list.hidden = !items.length && !list.children.length;
      theme();
      place();
      move(act < 0 && el === input && input.value ? 0 : act);
      list.scrollTop = 0;
      if (act > 0) items[act].li.scrollIntoView({ block: 'nearest' });
    };
    var close = function () {
      list.hidden = true;
      owner = null;
      [input, year, eng].forEach(function (x) { x.setAttribute('aria-expanded', 'false'); x.removeAttribute('aria-activedescendant'); });
    };
    var move = function (i) {
      if (!items.length) return;
      act = Math.max(0, Math.min(items.length - 1, i));
      items.forEach(function (it, k) { it.li.classList.toggle('is-act', k === act); });
      if (owner) owner.setAttribute('aria-activedescendant', items[act].li.id);
      if (act === 0) list.scrollTop = 0; else items[act].li.scrollIntoView({ block: 'nearest' });
    };
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

    var setMake = function (mk) {
      if (curMake() === mk) return;
      var r = inCalc ? document.querySelector('input[name="calc-make"][value="' + mk + '"]') : form && form.querySelector('input[name="make"][data-make-id="' + mk + '"]');
      if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
    };

    var openModels = function () {
      var cur = curMake();
      var q = input.value === (st.m ? (st.g ? genName(st.m, st.g) : st.m.name) : '') && st.m ? '' : input.value;
      var res = search(q, allowed, cur);
      var rows = res.map(function (r) {
        var other = cur && r.m.make !== cur || !cur;
        var sub = r.g ? r.g.from + '–' + (r.g.now ? L('н. в.', 'now') : r.g.to) : '';
        return {
          html: esc(r.g ? genName(r.m, r.g) : r.m.name + (r.year ? ' ' + r.year : '')) + (other ? '<span class="carpick__mk">' + MAKE_NAMES[r.m.make] + '</span>' : '') + (sub ? '<small>' + sub + '</small>' : ''),
          sel: st.m === r.m && st.g === (r.g || null),
          pick: function () { chooseModel(r.m, r.g || null, r.year || 0); }
        };
      });
      var typed = input.value.trim();
      if (typed && !res.some(function (r) { return r.score >= 3; })) {
        rows.push({ cls: 'carpick__free', html: esc(L('Нет в списке — оставить «' + typed + '»', 'Not listed — keep “' + typed + '”')), pick: function () { chooseFree(typed); } });
      }
      if (!rows.length) rows.push({ cls: 'carpick__free', html: esc(L('Начните вводить модель', 'Start typing a model')), pick: function () {} });
      open(input, rows);
    };
    var chooseModel = function (m, g, y) {
      setMake(m.make);
      st.m = m; st.g = g; st.free = '';
      st.y = 0; st.e = null;
      if (y) st.y = y;
      else if (g && g.from === g.to) st.y = g.from;
      paint();
      close();
      // next step opens by itself
      setTimeout(function () { if (st.y) { eng.focus(); openEngines(); } else { year.focus(); openYears(); } }, 0);
    };
    var chooseFree = function (t) {
      st.m = null; st.g = null; st.y = 0; st.e = null; st.free = t;
      paint();
      close();
    };
    var openYears = function () {
      if (!st.m) return;
      var multi = !st.g && st.m.gens.length > 1;
      open(year, years().map(function (o) {
        return {
          html: o.y + (multi ? '<small>' + esc(o.gens.map(function (g) { return genName(st.m, g).slice(st.m.name.length + 1); }).filter(Boolean).join(' / ')) + '</small>' : ''),
          sel: o.y === st.y,
          pick: function () {
            st.y = o.y;
            if (st.e && !engines().some(function (x) { return x.g === st.e.g && x.list.some(function (e) { return e.name === st.e.name; }); })) st.e = null;
            paint();
            close();
            setTimeout(function () { eng.focus(); openEngines(); }, 0);
          }
        };
      }));
    };
    var openEngines = function () {
      if (!st.m || !st.y) return;
      var groups = engines(), rows = [];
      groups.forEach(function (gr) {
        if (groups.length > 1) rows.push({ group: genName(st.m, gr.g) + ' · ' + gr.g.from + '–' + (gr.g.now ? L('н. в.', 'now') : gr.g.to) });
        gr.list.forEach(function (e) {
          rows.push({
            html: esc(engName(e.name)) + (e.name === 'EV' ? '' : '<small>' + fuel(e.name) + '</small>'),
            sel: st.e && st.e.name === e.name && st.e.g === gr.g,
            pick: function () { st.e = { name: e.name, g: gr.g }; paint(); close(); }
          });
        });
      });
      open(eng, rows);
    };

    /* events */
    input.addEventListener('focus', function () { input.select(); openModels(); });
    input.addEventListener('click', function () { if (list.hidden) openModels(); });
    input.addEventListener('input', function () {
      st.m = null; st.g = null; st.y = 0; st.e = null; st.free = input.value.trim();
      year.value = ''; eng.value = ''; year.disabled = true; eng.disabled = true;
      compose();
      openModels();
    });
    year.addEventListener('focus', openYears);
    year.addEventListener('click', function () { if (list.hidden) openYears(); });
    eng.addEventListener('focus', openEngines);
    eng.addEventListener('click', function () { if (list.hidden) openEngines(); });
    [input, year, eng].forEach(function (el) {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) el.dispatchEvent(new Event('click')); else move(act + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(act - 1); }
        else if (e.key === 'Enter') { if (!list.hidden && items[act]) { e.preventDefault(); items[act].pick(); } }
        else if (e.key === 'Escape') { if (!list.hidden) { e.preventDefault(); close(); } }
        else if (e.key === 'Tab') close();
        else if ((e.key === 'Backspace' || e.key === 'Delete') && el !== input) {
          e.preventDefault();
          if (el === eng) st.e = null; else { st.y = 0; st.e = null; }
          paint(); close();
        }
      });
      el.addEventListener('blur', function () { setTimeout(function () { if (!wrap.contains(document.activeElement)) close(); }, 120); });
    });
    document.addEventListener('pointerdown', function (e) { if (!wrap.contains(e.target) && !list.contains(e.target)) close(); });
    addEventListener('resize', function () { if (owner) place(); });
    addEventListener('scroll', function () { if (owner) place(); }, true);

    // a different make clears a car of another make
    var onMake = function () {
      var mk = curMake();
      if (st.m && mk && st.m.make !== mk) { st.m = null; st.g = null; st.y = 0; st.e = null; st.free = ''; paint(); }
    };
    if (inCalc) document.querySelectorAll('input[name="calc-make"]').forEach(function (r) { r.addEventListener('change', onMake); });
    else if (form) form.querySelectorAll('input[name="make"]').forEach(function (r) { r.addEventListener('change', onMake); });

    paint();
  };

  var run = function () {
    document.querySelectorAll('[data-booking] input[name="model"], [data-check] input[name="model"]').forEach(function (i) {
      if (i.type !== 'hidden') enhance(i);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.VAG_CARS = { CARS: CARS, search: search };
})();
