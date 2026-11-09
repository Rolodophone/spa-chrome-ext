let shiftIsPressed = false;
let autoCompletions = null;
const MAX_AUTO_COMPLETIONS = 500;

autoCompletions = null

function main() {
    console.log("[SPA] Loaded.");

    document.addEventListener("keydown", (event) => {
        if (event.key === "Shift" && !shiftIsPressed) {
            shiftIsPressed = true;
//            console.log("[SPA] Shift key pressed.")
        }
        else if (event.key === "Enter") {
            trySaveAutoCompletion();
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.key === "Shift" && shiftIsPressed) {
            shiftIsPressed = false;
//            console.log("[SPA] Shift key released.")
        }
    });

    document.addEventListener("focusin", (event) => {
        // initialise things when focus moves to the event title field
        if (event.target.getAttribute("aria-label") === "Add title") {
            console.debug("[SPA] focusin on add title field")
            if (autoCompletions === null) {
                loadAutoCompletions()
                console.log("[SPA] autoCompletions:", autoCompletions);
            }
        }
    });

    document.addEventListener("click", (event) => {
        // console.debug("clicked on:", event.target)
        if (event.target.parentElement !== null &&
                event.target.parentElement.getAttribute("jsname") === "x8hlje") {
            trySaveAutoCompletion();
        }
    });

    document.addEventListener("beforeinput", event => {
        // Autocomplete event title & calendar
        if (event.target.getAttribute("aria-label") === "Add title" &&
                event.inputType === "insertText") {

            let titleField = document.activeElement;
            let titleBefore = titleField.value;
            let caretPos = titleField.selectionEnd;

            if (caretPos === titleBefore.length) { // Only autocomplete if caret is at the end
                if (autoCompletions === null) loadAutoCompletions();
                console.log("[SPA] Autocompleting; autoCompletions:", autoCompletions);

                // Find calendar list element
                let calendarList = document.querySelector('[aria-label="List of calendars"]');
                if (calendarList === null) {
                    console.error("[SPA] Could not find calendar list element.");
                    return
                }

                // Check if there's a matching autocompletion
                let titleAfter = titleBefore.substring(0, titleField.selectionStart) + event.data;
                let autoCompleteCandidates = autoCompletions.events.filter(
                    (event) => event.title.startsWith(titleAfter));
                // console.log("autoCompleteCandidates:", autoCompleteCandidates);

                if (autoCompleteCandidates.length >= 1) {
                    // Matching auto-completion found -> auto-complete

                    let chosenAutoCompletion = autoCompleteCandidates[0]

                    // auto-complete title
                    titleField.value = chosenAutoCompletion.title;
                    // console.log("new titleField.value: " + titleField.value);
                    // console.log("titleAfter: " + titleAfter);
                    titleField.setSelectionRange(titleAfter.length, -1);
                    event.preventDefault()  //prevent typed character replacing the autocompleted text

                    // auto-complete calendar
                    selectCalendar(calendarList, chosenAutoCompletion.calendar);
                }

                else if (autoCompletions.events.length > 0) {
                    // No match found -> just set calendar to last used
                    selectCalendar(calendarList, autoCompletions.events[0].calendar);
                }
            }
        }
    })

    delay(1000, handleDialog);
}

function trySaveAutoCompletion() {
    console.debug("[SPA] trySaveAutoCompletion");
    let titleField = document.querySelector('.Fgl6fe-fmcmS-wGMbrd[aria-label="Add title"]');
    let calendarField = document.querySelector('[aria-label="Calendar"][role="combobox"]');
    console.debug("[SPA] titleField:", titleField);
    console.debug("[SPA] calendarField:", calendarField);

    // in this case we're not saving an event so no need to do anything
    if (titleField === null || calendarField === null) return;

    if (autoCompletions === null) loadAutoCompletions();

    let titleText = titleField.value;
    let calendarText = normaliseCalendarName(calendarField.textContent);
    console.log("[SPA] Saving auto-completion: " + titleText + " in " + calendarText);

    // Move this title/calendar pair to the front, removing any older copy of it
    autoCompletions.events = autoCompletions.events.filter(
        x => !(x.title === titleText && normaliseCalendarName(x.calendar) === calendarText));
    autoCompletions.events.unshift({title: titleText, calendar: calendarText});
    autoCompletions.events.length = Math.min(autoCompletions.events.length, MAX_AUTO_COMPLETIONS);
    localStorage.setItem("autoCompletions", JSON.stringify(autoCompletions));
}

// This is only called once, on the first focusin event. Afterwards we just reuse the same object
// in memory, as we do add any new events to it anyway.
function loadAutoCompletions() {
    autoCompletions = JSON.parse(localStorage.getItem("autoCompletions"));
    if (autoCompletions === null) {
        autoCompletions = {events: []};
        return;
    }

    // Older versions appended every save, so tidy up lists saved by them: keep only the most
    // recent copy of each title/calendar pair, and only the most recent MAX_AUTO_COMPLETIONS.
    let seen = new Set();
    let events = [];
    for (let x of autoCompletions.events) {
        let calendar = normaliseCalendarName(x.calendar);
        let key = JSON.stringify([x.title, calendar]);
        if (seen.has(key)) continue;
        seen.add(key);
        events.push({title: x.title, calendar: calendar});
        if (events.length === MAX_AUTO_COMPLETIONS) break;
    }
    if (events.length !== autoCompletions.events.length) {
        autoCompletions.events = events;
        localStorage.setItem("autoCompletions", JSON.stringify(autoCompletions));
    }
}

// Calendar names can contain runs of whitespace (e.g. "🧭  Career") that are rendered
// differently in different parts of the UI, so compare names with whitespace collapsed.
function normaliseCalendarName(name) {
    return name.replace(/\s+/g, " ").trim();
}

// Click the entry for the given calendar in the event dialog's list of calendars.
// The list is built by Google Calendar from the user's calendars, so any calendar works.
function selectCalendar(calendarList, calendarName) {
    let wanted = normaliseCalendarName(calendarName);
    for (const elem of calendarList.querySelectorAll(':scope > li')) {
        if (normaliseCalendarName(elem.textContent) === wanted) {
            elem.click();
            return true;
        }
    }
    console.warn("[SPA] Could not find calendar in list:", calendarName);
    return false;
}

function delay(time, func) {
    new Promise(resolve => setTimeout(resolve, time)).then(func);
}

function handleDialog() {
    // Do not auto handle dialog when editing event, as this feature is not intuitive in this case
    if (window.location.href.includes("eventedit")) {
        delay(100, handleDialog);
        return;
    }

    if (shiftIsPressed) {
//        console.debug("[SPA] Shift is pressed; handling dialog with 'this and following events' option.");
    	if (pressFollowingEventsBtn()) {
    	    delay(100, pressOkBtn);
            delay(200, handleDialog);
    	} else {
            delay(100, handleDialog);
        }
    }
    else {
//        console.debug("[SPA] Shift is not pressed; handling dialog with default option.");
        pressOkBtn();
        delay(100, handleDialog);
    }
}

function pressFollowingEventsBtn() {
	let possibleThisAndFollowingBtn = document.getElementsByClassName("GhEnC-gBXA9-bMcfAe");
//	console.debug("Found %d candidates for 'this and following events' button", possibleThisAndFollowingBtn.length)
    if (possibleThisAndFollowingBtn.length === 2 || possibleThisAndFollowingBtn.length === 3) {
		possibleThisAndFollowingBtn[1].checked = true;
		console.debug("[SPA] Found and clicked \"this and following events\" button.");
		return true;
	}
	return false;
}

function pressOkBtn() {
    let possibleOkBtn = document.getElementsByClassName("UywwFc-LgbsSe UywwFc-LgbsSe-OWXEXe-dgl2Hf");
    // console.debug("Found %d candidates for 'ok' button", possibleOkBtn.length)
    if (possibleOkBtn.length === 1) {
        possibleOkBtn[0].click();
        console.debug("[SPA] Found and clicked OK button.");
        return true;
    }
    return false;
}

main();