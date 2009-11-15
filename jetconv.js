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
var manifest = { 
  settings: [
    {
      id:      "enabledCurrencies",
      name:    "enabledCurrencies",
      type:    "text",
      label:   "Enabled currencies (comma separated)",
      default: "EUR,GBP,USD,JPY"
    }
  ]
};

jetpack.future.import("menu");
jetpack.future.import("selection");
jetpack.future.import("storage.settings");

jetpack.menu.context.page.add(function(target)({
  id:    "JetConvMenu",
  label: "Convert currency from...",
  icon:  "http://www.google.com/finance/favicon.ico",
  menu:  new jetpack.Menu(buildMenuConfiguration()),
  command: function(menuItem){
    if ('configure' == menuItem.data) {
      return target.document.location = 'about:jetpack';
    }
    var selectedText = jQuery.trim(jetpack.selection.text);
    if ('' == selectedText) {
      return jetpack.notifications.show('Empty selection');
    }
    if (false == /^[0-9,\.\s]*$/.test(selectedText)) {
      return jetpack.notifications.show('Selected text does not hold a valid number');
    }
    var sourceCurrency = jQuery.trim(menuItem.data.substring(0, menuItem.data.lastIndexOf(':')));
    var targetCurrency = jQuery.trim(menuItem.data.substring(menuItem.data.lastIndexOf(':') + 1));
    if ('' == sourceCurrency || '' == targetCurrency)
    {
      return jetpack.notifications.show({
        title: 'JetConv error',
        icon: "http://www.google.com/finance/favicon.ico",
        body: 'Invalid currencies (' + sourceCurrency + '/' + targetCurrency + ')',
      });
    }
    $.get('http://www.google.com/finance/converter?a=' + selectedText + '&from=' + sourceCurrency + '&to=' + targetCurrency, function(result){
      var matches = result.match(/currency_converter_result>(.*) = <span class=bld>(.*)</i);
      return jetpack.notifications.show({
        title: 'JetConv Conversion Result',
        icon: "http://code.google.com/intl/fr/apis/finance/images/gdata-finance.png",
        body: matches ? matches[1] + " = " + matches[2] : 'No result',
      });
    });
  }
}));

var buildMenuConfiguration = function(all) {
  if (true == all) {
    var enabledCurrencies = [];
    for (var i in currencyCodes) {
      enabledCurrencies[i] = enabledCurrencies.push(i);
    }
  } else {
    var enabledCurrencies = (jetpack.storage.settings.enabledCurrencies || "EUR,GBP,USD,JPY").split(/\s?,\s?/);
  }
  var nb = enabledCurrencies.length;
  var menu = [];
  for (var i = 0; i < nb; i++) {
    var subMenu = [];
    for (var j = 0; j < nb; j++) {
      if (enabledCurrencies[j] != enabledCurrencies[i]) {
        subMenu[j] = {
          label: currencyCodes[enabledCurrencies[j]] + ' (' + enabledCurrencies[j] + ')',
          data:  enabledCurrencies[i] + ':' + enabledCurrencies[j]
        };
      }
    }
    menu[i] = {
      label: currencyCodes[enabledCurrencies[i]] + ' (' + enabledCurrencies[i] + ') to...',
      menu:  new jetpack.Menu(subMenu),
    };
  };
  if (true != all) {
    menu[i++] = { type: 'separator' };
    menu[i++] = { label: "Other currencies...", menu: new jetpack.Menu(buildMenuConfiguration(true)) }
    menu[i++] = { type: 'separator' };
    menu[i++] = { label: "Configure", data: 'configure' }
  }
  return menu;
}

var currencyCodes = {
  "AED": "United Arab Emirates Dirham",
  "ANG": "Netherlands Antillean Gulden",
  "ARS": "Argentine Peso",
  "AUD": "Australian Dollar",
  "BGN": "Bulgarian Lev",
  "BHD": "Bahraini Dinar",
  "BND": "Brunei Dollar",
  "BOB": "Bolivian Boliviano",
  "BRL": "Brazilian Real",
  "BWP": "Botswana Pula",
  "CAD": "Canadian Dollar",
  "CHF": "Swiss Franc",
  "CLP": "Chilean Peso",
  "CNY": "Chinese Yuan",
  "COP": "Colombian Peso",
  "CZK": "Czech Koruna",
  "DKK": "Danish Krone",
  "EEK": "Estonian Kroon",
  "EGP": "Egyptian Pound",
  "EUR": "Euro",
  "FJD": "Fijian Dollar",
  "GBP": "British Pound",
  "HKD": "Hong Kong Dollar",
  "HNL": "Honduran Lempira",
  "HRK": "Croatian Kuna",
  "HUF": "Hungarian Forint",
  "IDR": "Indonesian Rupiah",
  "ILS": "New Israeli Sheqel",
  "INR": "Indian Rupee",
  "ISK": "Icelandic Króna",
  "JPY": "Japanese Yen",
  "KRW": "South Korean Won",
  "KWD": "Kuwaiti Dinar",
  "KZT": "Kazakhstani Tenge",
  "LKR": "Sri Lankan Rupee",
  "LTL": "Lithuanian Litas",
  "MAD": "Moroccan Dirham",
  "MUR": "Mauritian Rupee",
  "MXN": "Mexican Peso",
  "MYR": "Malaysian Ringgit",
  "NOK": "Norwegian Krone",
  "NPR": "Nepalese Rupee",
  "NZD": "New Zealand Dollar",
  "OMR": "Omani Rial",
  "PEN": "Peruvian Nuevo Sol",
  "PHP": "Philippine Peso",
  "PKR": "Pakistani Rupee",
  "PLN": "Polish Złoty",
  "QAR": "Qatari Riyal",
  "RON": "New Romanian Leu",
  "RSD": "Serbian Dinar",
  "RUB": "Russian Ruble",
  "SAR": "Saudi Riyal",
  "SEK": "Swedish Krona",
  "SGD": "Singapore Dollar",
  "SIT": "Slovenian Tolar",
  "SKK": "Slovak Koruna",
  "THB": "Thai Baht",
  "TRY": "New Turkish Lira",
  "TTD": "Trinidad and Tobago Dollar",
  "TWD": "New Taiwan Dollar",
  "UAH": "Ukrainian Hryvnia",
  "USD": "United States Dollar",
  "VEB": "Venezuelan Bolívar",
  "ZAR": "South African Rand",
};

// TODO: parse selected text to find a currency sign and propose preselected matching currencies
var symbols = {
  '$'  : ['ARS', 'AUD', 'BND', 'CAD', 'CLP', 'COP', 'FJD', 'HKD', 'MXN', 'NZD', 'SGD', 'TTD', 'TWD', 'USD', 'XCD'],
  'R$' : ['BRL'],
  '£'  : ['GBP', 'EGP'],
  'лв' : ['BGN'],
  '¥'  : ['JPY'],
  'Kč' : ['CZK'],
  '₪'  : ['ILS'],
  '₩'  : ['KRW'],
  'Lt' : ['LTL'],
  '₨'  : ['NPR'],
  'ƒ'  : ['ANG'],
};