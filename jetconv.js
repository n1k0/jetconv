/**
 * JetConv is a mozilla Jetpack allowing to convert an amount of money
 * into another currency, using the Google Finance API.
 *
 * Once installed, just select some number on any page, right-click and convert 
 * it choosing both initial and target currencies using the 
 * "Convert currency from..." contextual menu.
 *
 * @author Nicolas Perriault <nperriault@gmail.com>
 */
jetpack.future.import("menu");
jetpack.future.import("selection");

jetpack.menu.context.page.add(function(target)({
  label: "Convert currency from...",
  icon:  "http://www.google.com/finance/favicon.ico",  
  menu:  new jetpack.Menu(buildMenu(currencies)),
  command: function(menuItem){
    var selectedText = jQuery.trim(jetpack.selection.text);
    if (!selectedText || '' == selectedText) {
      return jetpack.notifications.show('Empty selection');
    }
    if (false == /^[0-9,\.\s]*$/.test(selectedText)) {
      return jetpack.notifications.show('Selected text does not hold a valid number');
    }
    var sourceCurrency = menuItem.data.substring(0, menuItem.data.lastIndexOf(':'));
    var targetCurrency = menuItem.data.substring(menuItem.data.lastIndexOf(':') + 1);
    $.get('http://www.google.com/finance/converter?a=' + selectedText + '&from=' + sourceCurrency + '&to=' + targetCurrency, function(result){
      var matches = result.match(/currency_converter_result>(.*) = <span class=bld>(.*)</i);
      jetpack.notifications.show(matches ? matches[1] + " = " + matches[2] : 'No result');
    });
  }
}));

var buildMenu = function(currencies) {
  var menu = [];
  var nb = currencies.length;
  for (var i = 0; i < nb; i++) {
    var subMenu = [];
    for (var j = 0; j < nb; j++) {
      subMenu[j] = {
        label: currencies[j].label,
        data:  currencies[i].data + ':' + currencies[j].data
      };
    }
    menu[i] = {
      label: currencies[i].label + ' to...',
      menu:  new jetpack.Menu(subMenu),
    };
  };
  return menu;
}

var currencies = [
  { label: "AED (United Arab Emirates Dirham)", data: "AED" },
  { label: "ANG (Netherlands Antillean Gulden)", data: "ANG" },
  { label: "ARS (Argentine Peso)", data: "ARS" },
  { label: "AUD (Australian Dollar)", data: "AUD" },
  { label: "BGN (Bulgarian Lev)", data: "BGN" },
  { label: "BHD (Bahraini Dinar)", data: "BHD" },
  { label: "BND (Brunei Dollar)", data: "BND" },
  { label: "BOB (Bolivian Boliviano)", data: "BOB" },
  { label: "BRL (Brazilian Real)", data: "BRL" },
  { label: "BWP (Botswana Pula)", data: "BWP" },
  { label: "CAD (Canadian Dollar)", data: "CAD" },
  { label: "CHF (Swiss Franc)", data: "CHF" },
  { label: "CLP (Chilean Peso)", data: "CLP" },
  { label: "CNY (Chinese Yuan (renminbi))", data: "CNY" },
  { label: "COP (Colombian Peso)", data: "COP" },
  { label: "CZK (Czech Koruna)", data: "CZK" },
  { label: "DKK (Danish Krone)", data: "DKK" },
  { label: "EEK (Estonian Kroon)", data: "EEK" },
  { label: "EGP (Egyptian Pound)", data: "EGP" },
  { label: "EUR (Euro)", data: "EUR" },
  { label: "FJD (Fijian Dollar)", data: "FJD" },
  { label: "GBP (British Pound)", data: "GBP" },
  { label: "HKD (Hong Kong Dollar)", data: "HKD" },
  { label: "HNL (Honduran Lempira)", data: "HNL" },
  { label: "HRK (Croatian Kuna)", data: "HRK" },
  { label: "HUF (Hungarian Forint)", data: "HUF" },
  { label: "IDR (Indonesian Rupiah)", data: "IDR" },
  { label: "ILS (New Israeli Sheqel)", data: "ILS" },
  { label: "INR (Indian Rupee)", data: "INR" },
  { label: "ISK (Icelandic Króna)", data: "ISK" },
  { label: "JPY (Japanese Yen)", data: "JPY" },
  { label: "KRW (South Korean Won)", data: "KRW" },
  { label: "KWD (Kuwaiti Dinar)", data: "KWD" },
  { label: "KZT (Kazakhstani Tenge)", data: "KZT" },
  { label: "LKR (Sri Lankan Rupee)", data: "LKR" },
  { label: "LTL (Lithuanian Litas)", data: "LTL" },
  { label: "MAD (Moroccan Dirham)", data: "MAD" },
  { label: "MUR (Mauritian Rupee)", data: "MUR" },
  { label: "MXN (Mexican Peso)", data: "MXN" },
  { label: "MYR (Malaysian Ringgit)", data: "MYR" },
  { label: "NOK (Norwegian Krone)", data: "NOK" },
  { label: "NPR (Nepalese Rupee)", data: "NPR" },
  { label: "NZD (New Zealand Dollar)", data: "NZD" },
  { label: "OMR (Omani Rial)", data: "OMR" },
  { label: "PEN (Peruvian Nuevo Sol)", data: "PEN" },
  { label: "PHP (Philippine Peso)", data: "PHP" },
  { label: "PKR (Pakistani Rupee)", data: "PKR" },
  { label: "PLN (Polish Złoty)", data: "PLN" },
  { label: "QAR (Qatari Riyal)", data: "QAR" },
  { label: "RON (New Romanian Leu)", data: "RON" },
  { label: "RSD (Serbian Dinar)", data: "RSD" },
  { label: "RUB (Russian Ruble)", data: "RUB" },
  { label: "SAR (Saudi Riyal)", data: "SAR" },
  { label: "SEK (Swedish Krona)", data: "SEK" },
  { label: "SGD (Singapore Dollar)", data: "SGD" },
  { label: "SIT (Slovenian Tolar)", data: "SIT" },
  { label: "SKK (Slovak Koruna)", data: "SKK" },
  { label: "THB (Thai Baht)", data: "THB" },
  { label: "TRY (New Turkish Lira)", data: "TRY" },
  { label: "TTD (Trinidad and Tobago Dollar)", data: "TTD" },
  { label: "TWD (New Taiwan Dollar)", data: "TWD" },
  { label: "UAH (Ukrainian Hryvnia)", data: "UAH" },
  { label: "USD (United States Dollar)", data: "USD" },
  { label: "VEB (Venezuelan Bolívar)", data: "VEB" },
  { label: "ZAR (South African Rand)", data: "ZAR" },
];