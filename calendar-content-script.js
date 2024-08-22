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
            console.log("[SPA] Shift key pressed.")
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.key === "Shift" && shiftIsPressed) {
            shiftIsPressed = false;
            console.log("[SPA] Shift key released.")
        }
    });

    document.addEventListener("beforeinput", event => {
        // Autocomplete event title
        if (document.activeElement.className === "VfPpkd-fmcmS-wGMbrd " &&
                event.inputType === "insertText") {

            console.log("[SPA] Autocompleting event title.");
            let input = document.activeElement;
            let inputValueBefore = input.value;
            let inputCaretPosition = input.selectionEnd;

            if (inputCaretPosition === inputValueBefore.length) { // Only autocomplete if caret is at the end
                console.log("event.data: " + event.data)
                let inputValueAfter = inputValueBefore.substring(0, input.selectionStart) + event.data;
                let autoCompleteCandidates = autoCompletions.events.filter(
                    (event) => event.title.startsWith(inputValueAfter));
                console.log("autoCompleteCandidates: " + autoCompleteCandidates);
                if (autoCompleteCandidates.length >= 1) {
                    input.value = autoCompleteCandidates[0].title;
                    console.log("new input.value: " + input.value);
                    console.log("inputValueAfter: " + inputValueAfter);
                    input.setSelectionRange(inputValueAfter.length, -1);
                    event.preventDefault()  //prevent typed character replacing the autocompleted text
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