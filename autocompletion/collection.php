<?php

// You can do a request in a table defined by "collection" and an column defined by "label"
// ex : SELECT id,".$_POST['label']." label FROM ".$_POST['collection']." ORDER BY ".$_POST['label']."

// Some country for the exemple.
if(isset($_POST['collection']) && isset($_POST['label']) && isset($_POST['value'])) {
	if($_POST['collection']=='country' && $_POST['label']=='name') {

		$valueTest = $_POST['value'];
		$valueLength = strlen($valueTest);

		$collection = '
		{"data":[
			{"id":"AF","label":"Afghanistan"},
			{"id":"AL","label":"Albania"},
			{"id":"DZ","label":"Algeria"},
			{"id":"AS","label":"American Samoa"},
			{"id":"AD","label":"Andorra"},
			{"id":"AO","label":"Angola"},
			{"id":"AI","label":"Anguilla"},
			{"id":"AQ","label":"Antarctica"},
			{"id":"AG","label":"Antigua and Barbuda"},
			{"id":"AR","label":"Argentina"},
			{"id":"AM","label":"Armenia"},
			{"id":"AW","label":"Aruba"},
			{"id":"AU","label":"Australia"},
			{"id":"AT","label":"Austria"},
			{"id":"AZ","label":"Azerbaijan"},
			{"id":"BS","label":"Bahamas"},
			{"id":"BH","label":"Bahrain"},
			{"id":"BD","label":"Bangladesh"},
			{"id":"BB","label":"Barbados"},
			{"id":"BY","label":"Belarus"},
			{"id":"BE","label":"Belgium"},
			{"id":"BZ","label":"Belize"},
			{"id":"BJ","label":"Benin"},
			{"id":"BM","label":"Bermuda"},
			{"id":"BT","label":"Bhutan"},
			{"id":"BO","label":"Bolivia"},
			{"id":"BA","label":"Bosnia and Herzegovina"},
			{"id":"BW","label":"Botswana"},
			{"id":"BV","label":"Bouvet Island"},
			{"id":"BR","label":"Brazil"},
			{"id":"IO","label":"British Indian Ocean Territory"},
			{"id":"BN","label":"Brunei Darussalam"},
			{"id":"BG","label":"Bulgaria"},
			{"id":"BF","label":"Burkina Faso"},
			{"id":"BI","label":"Burundi"},
			{"id":"KH","label":"Cambodia"},
			{"id":"CM","label":"Cameroon"},
			{"id":"CA","label":"Canada"},
			{"id":"CV","label":"Cape Verde"},
			{"id":"KY","label":"Cayman Islands"},
			{"id":"CF","label":"Central African Republic"},
			{"id":"TD","label":"Chad"},
			{"id":"CL","label":"Chile"},
			{"id":"CN","label":"China"},
			{"id":"CX","label":"Christmas Island"},
			{"id":"CC","label":"Cocos (Keeling) Islands"},
			{"id":"CO","label":"Colombia"},
			{"id":"KM","label":"Comoros"},
			{"id":"CG","label":"Congo"},
			{"id":"CD","label":"Congo, the Democratic Republic of the"},
			{"id":"CK","label":"Cook Islands"},
			{"id":"CR","label":"Costa Rica"},
			{"id":"CI","label":"Cote D\'Ivoire"},
			{"id":"HR","label":"Croatia"},
			{"id":"CU","label":"Cuba"},
			{"id":"CY","label":"Cyprus"},
			{"id":"CZ","label":"Czech Republic"},
			{"id":"DK","label":"Denmark"},
			{"id":"DJ","label":"Djibouti"},
			{"id":"DM","label":"Dominica"},
			{"id":"DO","label":"Dominican Republic"},
			{"id":"EC","label":"Ecuador"},
			{"id":"EG","label":"Egypt"},
			{"id":"SV","label":"El Salvador"},
			{"id":"GQ","label":"Equatorial Guinea"},
			{"id":"ER","label":"Eritrea"},
			{"id":"EE","label":"Estonia"},
			{"id":"ET","label":"Ethiopia"},
			{"id":"FK","label":"Falkland Islands (Malvinas)"},
			{"id":"FO","label":"Faroe Islands"},
			{"id":"FJ","label":"Fiji"},
			{"id":"FI","label":"Finland"},
			{"id":"FR","label":"France"},
			{"id":"GF","label":"French Guiana"},
			{"id":"PF","label":"French Polynesia"},
			{"id":"TF","label":"French Southern Territories"},
			{"id":"GA","label":"Gabon"},
			{"id":"GM","label":"Gambia"},
			{"id":"GE","label":"Georgia"},
			{"id":"DE","label":"Germany"},
			{"id":"GH","label":"Ghana"},
			{"id":"GI","label":"Gibraltar"},
			{"id":"GR","label":"Greece"},
			{"id":"GL","label":"Greenland"},
			{"id":"GD","label":"Grenada"},
			{"id":"GP","label":"Guadeloupe"},
			{"id":"GU","label":"Guam"},
			{"id":"GT","label":"Guatemala"},
			{"id":"GN","label":"Guinea"},
			{"id":"GW","label":"Guinea-Bissau"},
			{"id":"GY","label":"Guyana"},
			{"id":"HT","label":"Haiti"},
			{"id":"HM","label":"Heard Island and Mcdonald Islands"},
			{"id":"VA","label":"Holy See (Vatican City State)"},
			{"id":"HN","label":"Honduras"},
			{"id":"HK","label":"Hong Kong"},
			{"id":"HU","label":"Hungary"},
			{"id":"IS","label":"Iceland"},
			{"id":"IN","label":"India"},
			{"id":"ID","label":"Indonesia"},
			{"id":"IR","label":"Iran, Islamic Republic of"},
			{"id":"IQ","label":"Iraq"},
			{"id":"IE","label":"Ireland"},
			{"id":"IL","label":"Israel"},
			{"id":"IT","label":"Italy"},
			{"id":"JM","label":"Jamaica"},
			{"id":"JP","label":"Japan"},
			{"id":"JO","label":"Jordan"},
			{"id":"KZ","label":"Kazakhstan"},
			{"id":"KE","label":"Kenya"},
			{"id":"KI","label":"Kiribati"},
			{"id":"KP","label":"Korea, Democratic People\'s Republic of"},
			{"id":"KR","label":"Korea, Republic of"},
			{"id":"KW","label":"Kuwait"},
			{"id":"KG","label":"Kyrgyzstan"},
			{"id":"LA","label":"Lao People\'s Democratic Republic"},
			{"id":"LV","label":"Latvia"},
			{"id":"LB","label":"Lebanon"},
			{"id":"LS","label":"Lesotho"},
			{"id":"LR","label":"Liberia"},
			{"id":"LY","label":"Libyan Arab Jamahiriya"},
			{"id":"LI","label":"Liechtenstein"},
			{"id":"LT","label":"Lithuania"},
			{"id":"LU","label":"Luxembourg"},
			{"id":"MO","label":"Macao"},
			{"id":"MK","label":"Macedonia, the Former Yugoslav Republic of"},
			{"id":"MG","label":"Madagascar"},
			{"id":"MW","label":"Malawi"},
			{"id":"MY","label":"Malaysia"},
			{"id":"MV","label":"Maldives"},
			{"id":"ML","label":"Mali"},
			{"id":"MT","label":"Malta"},
			{"id":"MH","label":"Marshall Islands"},
			{"id":"MQ","label":"Martinique"},
			{"id":"MR","label":"Mauritania"},
			{"id":"MU","label":"Mauritius"},
			{"id":"YT","label":"Mayotte"},
			{"id":"MX","label":"Mexico"},
			{"id":"FM","label":"Micronesia, Federated States of"},
			{"id":"MD","label":"Moldova, Republic of"},
			{"id":"MC","label":"Monaco"},
			{"id":"MN","label":"Mongolia"},
			{"id":"MS","label":"Montserrat"},
			{"id":"MA","label":"Morocco"},
			{"id":"MZ","label":"Mozambique"},
			{"id":"MM","label":"Myanmar"},
			{"id":"NA","label":"Namibia"},
			{"id":"NR","label":"Nauru"},
			{"id":"NP","label":"Nepal"},
			{"id":"NL","label":"Netherlands"},
			{"id":"AN","label":"Netherlands Antilles"},
			{"id":"NC","label":"New Caledonia"},
			{"id":"NZ","label":"New Zealand"},
			{"id":"NI","label":"Nicaragua"},
			{"id":"NE","label":"Niger"},
			{"id":"NG","label":"Nigeria"},
			{"id":"NU","label":"Niue"},
			{"id":"NF","label":"Norfolk Island"},
			{"id":"MP","label":"Northern Mariana Islands"},
			{"id":"NO","label":"Norway"},
			{"id":"OM","label":"Oman"},
			{"id":"PK","label":"Pakistan"},
			{"id":"PW","label":"Palau"},
			{"id":"PS","label":"Palestinian Territory, Occupied"},
			{"id":"PA","label":"Panama"},
			{"id":"PG","label":"Papua New Guinea"},
			{"id":"PY","label":"Paraguay"},
			{"id":"PE","label":"Peru"},
			{"id":"PH","label":"Philippines"},
			{"id":"PN","label":"Pitcairn"},
			{"id":"PL","label":"Poland"},
			{"id":"PT","label":"Portugal"},
			{"id":"PR","label":"Puerto Rico"},
			{"id":"QA","label":"Qatar"},
			{"id":"RE","label":"Reunion"},
			{"id":"RO","label":"Romania"},
			{"id":"RU","label":"Russian Federation"},
			{"id":"RW","label":"Rwanda"},
			{"id":"SH","label":"Saint Helena"},
			{"id":"KN","label":"Saint Kitts and Nevis"},
			{"id":"LC","label":"Saint Lucia"},
			{"id":"PM","label":"Saint Pierre and Miquelon"},
			{"id":"VC","label":"Saint Vincent and the Grenadines"},
			{"id":"WS","label":"Samoa"},
			{"id":"SM","label":"San Marino"},
			{"id":"ST","label":"Sao Tome and Principe"},
			{"id":"SA","label":"Saudi Arabia"},
			{"id":"SN","label":"Senegal"},
			{"id":"CS","label":"Serbia and Montenegro"},
			{"id":"SC","label":"Seychelles"},
			{"id":"SL","label":"Sierra Leone"},
			{"id":"SG","label":"Singapore"},
			{"id":"SK","label":"Slovakia"},
			{"id":"SI","label":"Slovenia"},
			{"id":"SB","label":"Solomon Islands"},
			{"id":"SO","label":"Somalia"},
			{"id":"ZA","label":"South Africa"},
			{"id":"GS","label":"South Georgia and the South Sandwich Islands"},
			{"id":"ES","label":"Spain"},
			{"id":"LK","label":"Sri Lanka"},
			{"id":"SD","label":"Sudan"},
			{"id":"SR","label":"Suriname"},
			{"id":"SJ","label":"Svalbard and Jan Mayen"},
			{"id":"SZ","label":"Swaziland"},
			{"id":"SE","label":"Sweden"},
			{"id":"CH","label":"Switzerland"},
			{"id":"SY","label":"Syrian Arab Republic"},
			{"id":"TW","label":"Taiwan, Province of China"},
			{"id":"TJ","label":"Tajikistan"},
			{"id":"TZ","label":"Tanzania, United Republic of"},
			{"id":"TH","label":"Thailand"},
			{"id":"TL","label":"Timor-Leste"},
			{"id":"TG","label":"Togo"},
			{"id":"TK","label":"Tokelau"},
			{"id":"TO","label":"Tonga"},
			{"id":"TT","label":"Trinidad and Tobago"},
			{"id":"TN","label":"Tunisia"},
			{"id":"TR","label":"Turkey"},
			{"id":"TM","label":"Turkmenistan"},
			{"id":"TC","label":"Turks and Caicos Islands"},
			{"id":"TV","label":"Tuvalu"},
			{"id":"UG","label":"Uganda"},
			{"id":"UA","label":"Ukraine"},
			{"id":"AE","label":"United Arab Emirates"},
			{"id":"GB","label":"United Kingdom"},
			{"id":"US","label":"United States"},
			{"id":"UM","label":"United States Minor Outlying Islands"},
			{"id":"UY","label":"Uruguay"},
			{"id":"UZ","label":"Uzbekistan"},
			{"id":"VU","label":"Vanuatu"},
			{"id":"VE","label":"Venezuela"},
			{"id":"VN","label":"Viet Nam"},
			{"id":"VG","label":"Virgin Islands, British"},
			{"id":"VI","label":"Virgin Islands, U.s."},
			{"id":"WF","label":"Wallis and Futuna"},
			{"id":"EH","label":"Western Sahara"},
			{"id":"YE","label":"Yemen"},
			{"id":"ZM","label":"Zambia"},
			{"id":"ZW","label":"Zimbabwe"}
		]}
		';

		$collection = json_decode($collection);
		$result = array("data"=>""); 
		foreach ($collection->data as $key => $value) {
			if(substr($value->label,0,$valueLength)==$valueTest) {
				$result['data'][] = $value;
			}
		}

		print_r(json_encode($result));

 }
}
else {
 echo '{"data" : [{"id":"null",label:"Empty"}]}';
}
