'use strict';

var controllerModule = angular.module('GuardSwiftApp.controllers');

controllerModule.config(['$translateProvider', function($translateProvider) {
	$translateProvider.translations('en', {
		// ACCOUNT
		"ACCOUNT" : 'Account',
		"BUY_EVENTS" : 'Køb hændelser',
		"TITLE_LOGIN" : 'Login to GuardSwift',
		"USERNAME" : 'Username',
		"PASSWORD" : 'Password',
		"LOGIN" : 'Login',
		"LOGOUT" : 'Logout',
		// CRUD
		"ADD" : 'Add',
		"SAVE" : 'Save',
		"SAVE_CHANGES" : 'Save changes',
		"CREATE" : 'Create',
		"UPDATE" : 'Update',
		"DELETE" : 'Delete',
		"EDIT" : 'Edit',
		"CANCEL" : 'Cancel',
		"ELEMENT" : 'Element',
		"SAVED" : 'saved',
		"UPDATED" : 'updated',
		"DELETED" : 'removed',
		// COMMON
		"AN_ERROR_OCCURED" : 'An error occured',
		"VISITS" : 'Visits',
		"YES" : 'Ja',
		"NO" : 'Nej',
		"CLOSE" : 'Close',
		"DETAILS" : 'Details',
		"NONE" : 'None',
		"NOT_SHARED" : 'Not shared',
		"ON" : 'On',
		"OFF" : 'Off',
		"TYPES" : 'Types',
		"LOG" : 'Log',
		"LOGS" : 'Logs',
		"ENTRY" : 'Item',
		"ENTRIES" : 'Items',
		"CREATE_ENTRY" : 'Create entry',
		"HIGH" : 'High',
		"LOW" : 'Low',
		"DISTANCE" : 'Distance',
		"DISTANCE_TO_ADDRESS" : 'Distance to address',
		"METERS" : 'meters',
		"NAME" : 'Name',
		"NUMBER" : 'Number',
		"ADDRESS" : 'Address',
		"STREETNUMBER" : 'Streetnumber',
		"STREETNUMBERS" : 'Streetnumbers',
		"CITY" : 'City',
		"ZIPCODE" : 'Zipcode',
		"EMAIL" : 'Email',
		"TIMESTART" : 'Time start',
		"TIMEEND" : 'Time end',
		"TIMERESET" : 'Reset time',
		"RESET" : 'Reset',
		"START" : 'Start',
		"END" : 'End',
		"CLIENT" : 'Client',
		"CONFIRM_ACTION" : 'Confirm action',
		"CONFIRM_DELETE" : 'Do you wish to delete',
		"TYPE" : 'Type',
		"AMOUNT" : 'Amount',
		"LOCATION" : 'Location',
		"REMARKS" : 'Remarks',
		"POSITION" : 'Position',
		"TIME_CREATED" : 'Time created',
		"SELECT_ALL" : 'Select all',
		"DAYS" : 'days',
		"WEEKDAY_SUNDAY" : 'Sunday',
		"WEEKDAY_MONDAY" : 'Monday',
		"WEEKDAY_TUESDAY" : 'Tuesday',
		"WEEKDAY_WEDNESDAY" : 'Wednesday',
		"WEEKDAY_THURSDAY" : 'Thursday',
		"WEEKDAY_FRIDAY" : 'Friday',
		"WEEKDAY_SATURDAY" : 'Saturday',
		// PAGE SPECIFIC
		"HOME_WELCOME_MESSAGE" : 'Welcome to GuardSwift',
		// DATA
		"ROOM_SLASH_CHECKPOINT" : 'Room/checkpoint',
		"MESSAGE" : 'Message',
		"CONTACT" : 'Contact',
		"DATA" : 'Data',
		"ALARM_GROUPS" : "Alarm groups",
		"GROUP" : "Gruppe",
		"GROUPS" : "Grupper",
		"GROUPS_CREATE" : "Create group",
		"GROUPS_LIST" : "Groups in database",
		"GUARD" : 'Guard',
		"GUARDS" : 'Guards',
		"GUARDS_CREATE" : 'Create guard',
		"GUARDS_LIST" : 'Guards in database',
		"GUARD_ID" : 'Guard id',
		"CLIENTS" : 'Clients',
		"CLIENTS_CREATE" : 'Create client',
		"CLIENTS_LIST" : 'Clients in database',
		"CLIENTS_SELECT" : 'Select client',
		"RECEIVE_REPORTS" : 'Receive reports',
		"NEW_LOCATION" : 'New location',
		// PLANNING
		"DESCRIPTION" : "Description",
		"IS_RESET_AT" : "Reset at",
		"PLANNING" : 'Planning',
		"CIRCUIT" : 'Circuit',
		"CIRCUITS" : 'Circuits',
		"CIRCUITS_CREATE" : 'Create Supervision',
		"CIRCUITS_LIST" : 'Supervisions',
		"CIRCUITS_SELECT" : 'Select supervision',
		"SUPERVISION" : 'Supervision',
		"SUPERVISIONS" : 'Supervisions',
		"STATIC_SUPERVISION" : 'Static supervisions',
		"STATIC_SUPERVISION_REPORTS" : 'Static supervision reports',
		'CIRCUITUNIT' : 'Supervision',
		"CIRCUITUNITS_NONE_SELECTED" : 'No supervision selected',
		"CIRCUITUNITS_CREATE" : 'Create upervision under: ',
		"CIRCUITUNITS_LIST" : 'Supervisions',
		"EVENT_TYPE_CREATE" : 'Create event type',
		"EVENT_TYPE" : "Hændelsestype",
		"EVENT_TYPES" : 'Event types',
		"EVENTS" : 'Events',
		"CHECKLISTS" : 'Checklists',
		"CHECKLIST_STARTUP" : 'Startup',
		"CHECKLIST_ENDING" : 'Ending',
		"DISTRICTWATCH" : 'District watch',
		"DISTRICTWATCHES" : 'District watches',
		'DISTRICTWATCHUNITS_LIST' : 'District watches',
		"NO_DISTRICTWATCHES" : 'No district watches',
		"DISTRICTWATCH_SELECT" : 'Select district watch',
		"DISTRICTWATCH_CREATE" : 'Create district watch',
		"DISTRICTWATCH_LIST" : 'District watches',
		"DISTRICTWATCH_NONE_SELECTED" : 'No district watch selected',
		// LOGS
		"EVENTLOG" : 'All events',
		"CIRCUITLOG" : 'Supervisions',
		"SHOW_EVENTS" : "Show events",
		"SHOW_REPORT" : "Show reports",
		"ALARMS" : "Alarms",
		"GPSLOG" : "GPS positions",
		"ALL_EVENTS" : "All events",
		"FROM_DATE" : "From date",
		"TO_DATE" : "To date",
		"REPORT" : "Report",
		"REPORTS" : "Reports",
		"ALARMREPORTS" : "Alarm reports",
		"CIRCUITUNITREPORTS" : "Circuitunit reports",
		// REPORTS
		"ALARM_REPORTS" : "Alarm reports",
		// ERROR MESSAGES
		"GPS_LOG_NOT_FOUND" : "GPS log not found",
		"REPORT_NOT_FOUND" : "Report not found",
		"ALARM_REPORT_NOT_FOUND" : "Alarm report not found",
		"NO_RESULTS_FOUND" : "No results found"

	});
	$translateProvider.translations('da', {
		// ACCOUNT
		"ACCOUNT" : 'Konto',
		"BUY_EVENTS" : 'Køb hændelser',
		"TITLE_LOGIN" : 'Log på GuardSwift',
		"USERNAME" : 'Brugernavn',
		"PASSWORD" : 'Kodeord',
		"LOGIN" : 'Log ind',
		"LOGOUT" : 'Log ud',
		// CRUD
		"ADD" : 'Tilføj',
		"SAVE" : 'Gem',
		"SAVE_CHANGES" : 'Gem ændringer',
		"CREATE" : 'Opret',
		"UPDATE" : 'Gem',
		"DELETE" : 'Slet',
		"EDIT" : 'Rediger',
		"CANCEL" : 'Annuller',
		"ELEMENT" : 'Element',
		"SAVED" : 'gemt',
		"UPDATED" : 'opdateret',
		"DELETED" : 'slettet',
		// COMMON
		"AN_ERROR_OCCURED" : 'Der opstod en fejl',	
		"VISITS" : 'Besøg',
		"YES" : 'Ja',
		"NO" : 'Nej',
		"CLOSE" : 'Luk',
		"DETAILS" : 'Detaljer',
		"NONE" : 'Ingen',
		"NOT_SHARED" : 'Ikke delt',
		"ON" : 'Til',
		"OFF" : 'Fra',
		"TYPES" : 'Typer',
		"LOG" : 'Historik',
		"LOGS" : 'Historik',
		"ENTRY" : "Punkt",
		"ENTRIES" : "Punkter",
		"CREATE_ENTRY" : 'Opret punkt',
		"HIGH" : 'Høj',
		"LOW" : 'Lav',
		"DISTANCE" : 'Afstand',
		"DISTANCE_TO_ADDRESS" : 'Afstand til adressen',
		"METERS" : 'meter',
		"NAME" : 'Navn',
		"NUMBER" : 'Nummer',
		"ADDRESS" : 'Adresse',
		"STREETNUMBER" : 'Husnr',
		"STREETNUMBERS" : 'Husnumre',
		"CITY" : 'By',
		"ZIPCODE" : 'Postnr',
		"EMAIL" : 'Email',
		"TIMESTART" : 'Start tid',
		"TIMEEND" : 'Slut tid',
		"TIMERESET" : 'Genstart tid',
		"RESET" : 'Genstart',
		"START" : 'Start',
		"END" : 'Slut',
		"CLIENT" : 'Kunde',
		"CONFIRM_ACTION" : 'Bekræft handling',
		"CONFIRM_DELETE" : 'Ønsker du at slette',
		"TYPE" : 'Type',
		"AMOUNT" : 'Antal',
		"LOCATION" : 'Placering',
		"REMARKS" : 'Bemærkninger',
		"POSITION" : 'Position',
		"TIME_CREATED" : 'Tid oprettet',
		"SELECT_ALL" : 'Vælg alle',
		"DAYS" : 'dage',
		"WEEKDAY_SUNDAY" : 'Søndag',
		"WEEKDAY_MONDAY" : 'Mandag',
		"WEEKDAY_TUESDAY" : 'Tirsdag',
		"WEEKDAY_WEDNESDAY" : 'Onsdag',
		"WEEKDAY_THURSDAY" : 'Torsdag',
		"WEEKDAY_FRIDAY" : 'Fredag',
		"WEEKDAY_SATURDAY" : 'Lørdag',
		// PAGE SPECIFIC
		"HOME_WELCOME_MESSAGE" : 'Velkommen til GuardSwift',
		// DATA
		"ROOM_SLASH_CHECKPOINT" : 'Lokale/checkpoint',
		"MESSAGE" : 'Besked',
		"CONTACT" : 'Kontaktperson',
		"DATA" : 'Data',
		"ALARM_GROUPS" : "Alarmgrupper",
		"GROUP" : "Gruppe",
		"GROUPS" : "Grupper",
		"GROUPS_CREATE" : "Opret gruppe",
		"GROUPS_LIST" : "Grupper",
		"GUARD" : 'Vægter',
		"GUARDS" : 'Vægtere',
		"GUARDS_CREATE" : 'Opret vægter',
		"GUARDS_LIST" : 'Vægtere',
		"GUARD_ID" : 'Vagt id',
		"CLIENTS" : 'Kunder',
		"CLIENTS_CREATE" : 'Opret kunde',
		"CLIENTS_LIST" : 'Kunder',
		"CLIENTS_SELECT" : 'Vælg kunde',
		"RECEIVE_REPORTS" : 'Modtag rapporter',
		"NEW_LOCATION" : 'Ny placering',
		// PLANNING
		"DESCRIPTION" : "Beskrivelse",
		"IS_RESET_AT" : "Genstartes kl",
		"PLANNING" : 'Planlægning',
		"CIRCUIT" : 'Kreds',
		"CIRCUITS" : 'Kredse',
		"CIRCUITS_CREATE" : 'Opret kreds',
		"CIRCUITS_LIST" : 'Kreds oversigt',
		"CIRCUITS_SELECT" : 'Vælg kreds',
		"SUPERVISION" : 'Tilsyn',
		"SUPERVISIONS" : 'Tilsyn',
		"STATIC_SUPERVISION" : 'Fastvagt',
		"STATIC_SUPERVISION_REPORTS" : 'Fastvagt rapporter',
		"CIRCUITUNIT" : 'Tilsyn',
		"CIRCUITUNITS_NONE_SELECTED" : 'Der er ikke valgt nogen kreds',
		"CIRCUITUNITS_CREATE" : 'Opret tilsyn under kreds: ',
		"CIRCUITUNITS_LIST" : 'Tilsyn',
		"EVENT_TYPE_CREATE" : "Opret hændelses type",
		"EVENT_TYPE" : "Hændelsestype",
		"EVENT_TYPES" : "Hændelsestyper",
		"EVENTS" : 'Hændelser',
		"CHECKLISTS" : 'Checklister',
		"CHECKLIST_STARTUP" : 'Opstart',
		"CHECKLIST_ENDING" : 'Afslutning',
		"DISTRICTWATCH" : 'Områdevagt',
		"DISTRICTWATCHES" : 'Områdevagter',
		'DISTRICTWATCHUNITS_LIST' : 'Områdevagter',
		"NO_DISTRICTWATCHES" : 'Ingen områdevagter',
		"DISTRICTWATCH_SELECT" : 'Vælg områdevagt',
		"DISTRICTWATCH_CREATE" : 'Opret områdevagt',
		"DISTRICTWATCH_LIST" : 'Områdevagter',
		"DISTRICTWATCH_NONE_SELECTED" : 'Der er ikke valgt nogen områdevagt',
		// LOGS
		"EVENTLOG" : 'Hændelses historik',
		"CIRCUITLOG" : 'Kreds historik',
		"SHOW_EVENTS" : "Vis hændelser",
		"SHOW_REPORT" : "Vis rapport",
		"ALARMS" : "Alarmer",
		"GPSLOG" : "GPS",
		"ALL_EVENTS" : "Alle hændelser",
		"FROM_DATE" : "Fra dato",
		"TO_DATE" : "Til dato",
		"REPORT" : "Rapport",
		"REPORTS" : "Rapporter",
		"ALARMREPORTS" : "Alarm rapporter",
		"CIRCUITUNITREPORTS" : "Tilsyns rapporter",
		// REPORTS
		"ALARM_REPORTS" : "Alarm rapporter",
		// ERROR MESSAGES
		"GPS_LOG_NOT_FOUND" : "GPS log ikke fundet",
		"REPORT_NOT_FOUND" : "Rapport ikke fundet",
		"ALARM_REPORT_NOT_FOUND" : "Alarm rapport ikke fundet",
		"NO_RESULTS_FOUND" : "Fandt ingen resultater",
	});
	$translateProvider.preferredLanguage('da');
}]);