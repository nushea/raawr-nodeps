const div = document.currentScript.parentElement;
var curpath = "/";
var pathHistory = [ curpath ];
var historyIndex = 0;

const breadcrumbs = div.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild;
console.log(breadcrumbs);
function setCookie(name, value) {
    document.cookie = name + "=" + encodeURIComponent(value) + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
}
function deleteCookie(name) {
    setCookie(name, "");
}

async function filList(pathname) {
  const curPath = pathname;

  try {
    const res = await fetch('http://localhost/api/wawAPI/' + curPath)
    const text = await res.text();
	if(curPath.startsWith("/home/")){
		var partialPath = curpath.substring(6);
		if(partialPath.includes('/'))
			partialPath = partialPath.substring(0, partialPath.indexOf('/'));
		setCookie('UserPath', "/home/"+partialPath);

	}
    return text.split('\n');
  } catch (err) {
    console.error('fetch failed:', err)
    return 'error fetching'
  }
}

function FileBlock(path, type, name){
	if(type == "#")
		typePath = "/img/icons8-folder-96.png";
	else
		typePath = "/img/icons8-file-96.png";
	return '<a href="#" onClick="clickedFolder(\''+path+ '\'); return false;" class="card"><img class="logo" src="'+typePath+'"><p class>'+name+'</p></a>';
}
function getFiles(pathname){
	console.log(historyIndex, pathHistory)
	pathname = pathname.trim();
	curpath = pathname;
	var files;
	filList(pathname).then(result => {
		files = result;
		var FileTable = "";
		files.forEach((file) => { if(file.trim().length > 0) FileTable += FileBlock(file.substring(file.lastIndexOf(" ")), file.substring(0,1), file.substring(file.lastIndexOf("/")+1) )});
		div.innerHTML = FileTable;
	});
}
function clickedFolder(pathname){
	if(pathHistory.length > 19)
		pathHistory.shift();
	if(historyIndex != pathHistory.length -1)
		pathHistory = pathHistory.splice(0, historyIndex + 1);
	pathHistory.push(pathname);
	historyIndex = pathHistory.length -1;
	getFiles(pathname);
}
function goUp(){
	if(curpath.indexOf('/') == curpath.lastIndexOf('/')){
		clickedFolder("/");
		return;
	}
	if(curpath.length>1){
		clickedFolder(curpath.substring(0,curpath.lastIndexOf('/')));
		return;
	}
	
}
function goHome(){
	if(getCookie("UserPath") != null)
		clickedFolder(getCookie("UserPath"));
	else
		clickedFolder("/home/");
}
function goBack(){
	if(historyIndex > 0){
		historyIndex -= 1;
		getFiles(pathHistory[historyIndex]);
	}
}
function goForward(){
	if(historyIndex < pathHistory.length - 1){
		historyIndex += 1;
		getFiles(pathHistory[historyIndex]);
	}
}
getFiles(curpath);

breadcrumbs.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
		clickedFolder(breadcrumbs.value);
        event.preventDefault(); // prevents form submission if inside a form
    }
});
