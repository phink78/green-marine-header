// Velo API-referentie: https://www.wix.com/velo/reference/api-overview/introduction
import wixWindowFrontend from "wix-window-frontend";

$w.onReady(function () {
	let lang = wixWindowFrontend.multilingual.currentLanguage; // "en"
	let locale = wixWindowFrontend.browserLocale;
	
	if(lang == "sv" || locale == "sv-SE") {
		lang == "sv";
	}

	console.log(locale);

	switch (lang) {
		case 'nl':  // Nederlands
		case 'nl-NL':
			console.log("Taal is Nederlands, selecteer keuze voor NL.");
			// Selecteer een optie of voer een actie uit voor Nederlands
			$w('#radioGroup1').value = 'NL';  // voorbeeld van taalkeuze dropdown selecteren
			break;
		case 'en':  // Engels
		case 'en-US':
		case 'en-GB':
			console.log("Taal is Engels, selecteer keuze voor EN.");
			// Selecteer een optie of voer een actie uit voor Engels
			$w('#radioGroup1').value = 'EN';
			break;
		case 'sv':  // Zweeds
		case 'sv-SE':
			console.log("Taal is Zweeds, selecteer keuze voor SV.");
			// Selecteer een optie of voer een actie uit voor Zweeds
			$w('#radioGroup1').value = 'SE';
			break;
		default:  // Standaardactie voor andere talen
			console.log("Taal is niet specifiek, selecteer standaard keuze.");
			// Standaard actie
			$w('#radioGroup1').value = 'EN';  // Standaard naar Engels
			break;
	}
});