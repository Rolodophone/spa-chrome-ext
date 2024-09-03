let shiftIsPressed = false;
let autoCompletions = null;

function main() {
    console.log("[SPA] Loaded.");

    document.addEventListener("keydown", (event) => {
        if (event.key === "Shift" && !shiftIsPressed) {
            shiftIsPressed = true;
            // console.log("[SPA] Shift key pressed.")
        }
        else if (event.key === "Enter") {
            trySaveAutoCompletion();
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.key === "Shift" && shiftIsPressed) {
            shiftIsPressed = false;
            // console.log("[SPA] Shift key released.")
        }
    });

    document.addEventListener("focusin", (event) => {
        // initialise things when focus moves to the event title field
        if (event.target.className === "VfPpkd-fmcmS-wGMbrd " &&
                event.target.getAttribute("aria-label") === "Add title") {
            loadAutoCompletions()
            console.log("autoCompletions:", autoCompletions);
        }
    });

    document.addEventListener("click", (event) => {
        console.log("event.target:", event.target)
        if (event.target.parentElement !== null &&
                event.target.parentElement.getAttribute("jsname") === "x8hlje") {
            trySaveAutoCompletion();
        }
    });

    document.addEventListener("beforeinput", event => {
        // Autocomplete event title & calendar
        if (document.activeElement.className === "VfPpkd-fmcmS-wGMbrd " &&
                event.target.getAttribute("aria-label") === "Add title" &&
                event.inputType === "insertText") {

            // console.log("[SPA] Autocompleting event title.");
            let titleField = document.activeElement;
            let titleBefore = titleField.value;
            let caretPos = titleField.selectionEnd;

            if (caretPos === titleBefore.length) { // Only autocomplete if caret is at the end
                // console.log("event.data: " + event.data)
                let titleAfter = titleBefore.substring(0, titleField.selectionStart) + event.data;
                let autoCompleteCandidates = autoCompletions.events.filter(
                    (event) => event.title.startsWith(titleAfter));
                console.log("autoCompleteCandidates:", autoCompleteCandidates);

                if (autoCompleteCandidates.length >= 1) {
                    let chosenAutoCompletion = autoCompleteCandidates[0]

                    // auto-complete title
                    titleField.value = chosenAutoCompletion.title;
                    // console.log("new titleField.value: " + titleField.value);
                    // console.log("titleAfter: " + titleAfter);
                    titleField.setSelectionRange(titleAfter.length, -1);
                    event.preventDefault()  //prevent typed character replacing the autocompleted text

                    // auto-complete calendar
                    let calendarListCandidates = document.getElementsByClassName(
                        "VfPpkd-rymPhb r6B9Fd bwNLcf P2Hi5d VfPpkd-OJnkse")
                    // console.log(calendarListCandidates);

                    for (const calendarList of calendarListCandidates) {
                        if (calendarList.getAttribute("aria-label") !== "List of calendars") continue;
                        // console.log("[SPA] Found calendar list.");

                        for (const elem of calendarList.children) {
                            // console.log(elem)
                            if (elem.tagName !== "LI") continue;
                            let calendarName = elem.children[2].children[0].innerHTML;
                            // console.log("innerHTML: " + calendarName);
                            // console.log("Looking for: " + chosenAutoCompletion.calendar);
                            if (calendarName === chosenAutoCompletion.calendar) {
                                elem.click();
                                // console.log("[SPA] Clicked calendar " + chosenAutoCompletion.calendar);
                                break;
                            }
                        }
                    }
                }
            }
        }
    })

    delay(1000, handleDialog);
}

function trySaveAutoCompletion() {
    console.log("trySaveAutoCompletion");
    let titleField = document.querySelector('.VfPpkd-fmcmS-wGMbrd[aria-label="Add title"]');
    let calendarField = document.querySelector('.VfPpkd-TkwUic[jsname="oYxtQd"] .VfPpkd-uusGie-fmcmS-haAclf .VfPpkd-uusGie-fmcmS[jsname="Fb0Bif"][aria-label=""]');
    console.log("titleField:", titleField);
    console.log("calendarField:", calendarField);

    // in this case we're not saving an event so no need to do anything
    if (titleField === null || calendarField === null) return;

    let titleText = titleField.value;
    let calendarText = calendarField.innerHTML;
    console.log("Saving auto-completion: " + titleText + " in " + calendarText);

    loadAutoCompletions()
    autoCompletions.events.unshift({title: titleText, calendar: calendarText});
    localStorage.setItem("autoCompletions", JSON.stringify(autoCompletions));
}

function loadAutoCompletions() {
    autoCompletions = JSON.parse(localStorage.getItem("autoCompletions"));
    if (autoCompletions === null) {
        autoCompletions = {events: []};
    }
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
    	pressFollowingEventsBtn();
    	delay(100, pressOkBtn);
    	delay(200, handleDialog);
    }
    else {
        pressOkBtn();
        delay(100, handleDialog);
    }
}

function pressFollowingEventsBtn() {
	let possibleThisAndFollowingBtn = document.getElementsByClassName("VfPpkd-gBXA9-bMcfAe");
	if (possibleThisAndFollowingBtn.length === 2 || possibleThisAndFollowingBtn.length === 3) {
		possibleThisAndFollowingBtn[1].checked = true;
		console.log("[SPA] Found and clicked \"this and following events\" button.");
	}
}

function pressOkBtn() {
    let possibleOkBtn = document.getElementsByClassName("uArJ5e UQuaGc kCyAyd l3F1ye ARrCac HvOprf evJWRb M9Bg4d");
    if (possibleOkBtn.length === 1) {
        possibleOkBtn[0].click();
        console.log("[SPA] Found and clicked OK button.");
    }
}

main();