function main() {
    console.log("[SPA] Loaded.");

    document.addEventListener("keydown", (event) => {
        if (event.key === "Delete") {
            console.log("[SPA] Delete key pressed.");
            delay(200).then(clickOk);
        }
    });

    document.addEventListener("mouseup", (event) => {
        console.log("[SPA] Mouse up event.");
        delay(200).then(clickOk);
    });
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function clickOk() {
    let possibleButtons = document.getElementsByClassName("uArJ5e");
    for (let possibleButton of possibleButtons) {
        if (possibleButton.className === "uArJ5e UQuaGc kCyAyd l3F1ye ARrCac HvOprf evJWRb M9Bg4d") {
            console.log("[SPA] Found and clicked button.");
            possibleButton.click();
            return;
        }
    }
    console.log("[SPA] Could not find button.");
}

main();