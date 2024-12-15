// console.clear()
let exists = null
let client = null
let link = window.location.href;
let regex = RegExp("/([a-zA-Z0-9]{10})(?:[/?]|$)");
let m = link.match(regex);
// console.log({match: m[1]})
let insertEl = document.querySelector("#ppd")

chrome.storage.onChanged.addListener((changes, area) => {
 	console.log({changes, area})
 	loadClientId()
});

// chrome.storage.sync.clear()


const loadClientId = async () => {
	try {
		const data = await chrome.storage.sync.get(null);
		console.log({data})
		if("clientId" in data && isFinite(data.clientId)) {
			loadIframe()
		}
		else {
			document.querySelector("#domo-iframe").remove()
		}
	}
	catch( err ) {
		console.log("ERR: "+err)
	}

	return;
}


loadClientId()


let loadIframe = async() => {

	console.log("loading iframe")

	// let url = `http://localhost:3000/hello`;
	let url = "https://jg7u2upo2udattxsajfylgh6ma0uobry.lambda-url.us-east-1.on.aws/hello"
	let resp = await fetch(url, {
		method: "POST",
		headers: (() => {
            let header = new Headers();
            header.append("Content-Type", `application/json`);
            header.append("Accept", `*/*`);
            return header
        })(),
		body: JSON.stringify({asin: m[1]})
	})

	resp = await resp.text()

	console.log({resp})

	try {
		console.log("removing document element")
		document.querySelector('#domo-form').remove()
	} catch (err) {
		console.log("ERR "+err)
	}

	let insertEl = document.querySelector("#ppd")
	// console.log({insertEl})
	let newEl = document.createElement('iframe')
	newEl.id = 'domo-iframe';
	newEl.srcdoc = resp
	newEl.style.minWidth = '100%';
	newEl.style.minHeight = '600px';
	newEl.style.border = "none";

	insertEl.after(newEl);	

}






// console.log(idInput)


