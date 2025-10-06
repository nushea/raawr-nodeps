const div = document.currentScript.parentElement;
var curpath = "/";
var pathHistory = [];

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
	if((curPath.match(/\//g) || []).length == 2 && curPath.substring(1, curPath.lastIndexOf('/')) == "home")
		setCookie('Username', curPath.substring(curPath.lastIndexOf('/')+1));
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
	pathHistory.push(pathname);
	console.log(pathHistory);
	getFiles(pathname);
}
getFiles("/");

