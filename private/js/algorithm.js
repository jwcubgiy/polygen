function ajax(type, url, data, error, success) {
    if (type != "get") {
        data = JSON.stringify(data);
    }

    $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: "json",
        success: res => {
            if (res.status == "success") {
                success(res.msg);
            } else {
                error(res.msg);
            }
        }
    });
}

function ajaxSync(type, url, data) {
    if (type != "get") {
        data = JSON.stringify(data);
    }

    return $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: "json",
        async: false
    }).responseJSON;
}

function userExists(username) {
    return ajaxSync("get", "/api/user/info", { username: username }).status == "success";
}

function textRenderer(s) {
    let a = document.createElement("div");

    a.innerHTML = DOMPurify.sanitize(marked.parse(s.trim()).replace(/(\n)*$/, ""), {
        FORBID_TAGS: ["nav", "article", "header"],
        KEEP_CONTENT: false,
        FORBID_ATTR: ["style"]
    });

    renderMathInElement(a, {
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
        ],
        throwOnError: false
    });

    a.querySelectorAll("pre code").forEach(hljs.highlightElement);

    addAt(a);

    return a.innerHTML;
}

function userLink(username) {
    if (!userExists(username)) {
        return username;
    }

    return `<a href="/user/${username}" class="at" style="color: ${randomColor({ seed: username })}">${username}</a>`;
}

function addAt(e) {
    e.innerHTML = e.innerHTML.replace(/@([\u4e00-\u9fa5_a-zA-Z0-9]{3,16})/g, `@<a class="unfinished-at">$1</a>`);

    e.querySelectorAll(".unfinished-at").forEach(el => el.outerHTML = userLink(el.innerHTML));
}

function deltaTime(s) {
    let interval = new Date().getTime() - new Date(s).getTime();

    let years = Math.floor(interval / (365 * 24 * 3600 * 1000));
    if (years == 0) {
        let months = Math.floor(interval / (30 * 24 * 3600 * 1000));
        if (months == 0) {
            let days = Math.floor(interval / (24 * 3600 * 1000));
            if (days == 0) {
                let leaveTime = interval % (24 * 3600 * 1000);
                let hours = Math.floor(leaveTime / (3600 * 1000));
                if (hours == 0) {
                    leaveTime = leaveTime % (3600 * 1000);
                    let minutes = Math.floor(leaveTime / (60 * 1000));
                    if (minutes == 0) {
                        leaveTime = leaveTime % (60 * 1000);
                        let seconds = Math.round(leaveTime / 1000);
                        return seconds + "??????";
                    }
                    return minutes + "?????????";
                }
                return hours + "?????????";
            }
            return days + "??????";
        }
        return months + "??????";
    }
    return years + "??????";
}