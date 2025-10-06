const div = document.currentScript.parentElement;

function FileBlock(path, type, name){
	if(type == "folder")
		typePath = "/img/icons8-folder-96.png";
	else
		typePath = "/img/icons8-file-96.png";
	return "<a href=\""+ path +"\" class=\"card\"><img class=\"logo\" src=\""+typePath+"\"><p class>"+name+"</p></a>";
}
div.innerHTML = FileBlock("fire", "file", "outerwildes");
for(let i=0;i<30;i++)
	div.innerHTML += FileBlock("fire", "file", "outerwildes");
