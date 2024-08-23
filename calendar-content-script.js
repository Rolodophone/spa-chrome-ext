// WARNING: this file is public on my github so do not put any sensitive information here
// Later I will move the autocompletion list to an untracked file
let autoCompletions = {
    events: [
        {title: "EA Bristol", calendar: "💡 EA"},
        {title: "Workout + post-workout + shower", calendar: "🧑 Personal"},
        {title: "Piano", calendar: "🧑 Personal"},
        {title: "Programming", calendar: "🧑 Personal"},
        {title: "Leisure", calendar: "🖥️ Leisure"},
        {title: "Reading", calendar: "🧑 Personal"},
        {title: "Language-learning", calendar: "🧑 Personal"},
        {title: "Shower", calendar: "🧑 Personal"},
        {title: "Tasks", calendar: "✅ Tasks"},
        {title: "Family", calendar: "👬 Social"},
        {title: "Friends", calendar: "👬 Social"},
        {title: "TV", calendar: "🖥️ Leisure"},
        {title: "Gaming", calendar: "🖥️ Leisure"},
        {title: "Distraction", calendar: "⏳Distraction"},
        {title: "Morning routine", calendar: "📋 Daily"},
        {title: "Social thinking", calendar: "🧑 Personal"},
        {title: "Shopping", calendar: "✅ Tasks"},
        {title: "Emails/messages", calendar: "✅ Tasks"},
        {title: "Task management", calendar: "✅ Tasks"},
    ]
}

let shiftIsPressed = false;

function main() {
    console.log("[SPA] Loaded.");

    document.addEventListener("keydown", (event) => {
        if (event.key === "Shift" && !shiftIsPressed) {
            shiftIsPressed = true;
            // console.log("[SPA] Shift key pressed.")
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.key === "Shift" && shiftIsPressed) {
            shiftIsPressed = false;
            // console.log("[SPA] Shift key released.")
        }
    });

    document.addEventListener("beforeinput", event => {
        // Autocomplete event title & calendar
        if (document.activeElement.className === "VfPpkd-fmcmS-wGMbrd " &&
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
                // console.log("autoCompleteCandidates: " + autoCompleteCandidates);

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