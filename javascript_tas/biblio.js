// pour animation
var changeStep = [];
var tasCopy = [];
var p0;
var p1;
var vx;
var vy;
var compteur = 0;
var debut = true;

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/*--------------------------------------------------*
 *                      verifyPile
 *--------------------------------------------------*
 */
function verifyPile() {
  printLog("Vérification tas :");
  // on parcours
  let pileOk = true;
  for (var i=0; i<((listTas.length-1)/2)|0; i++) {
    let nodeOk = true;
    if ((listTas[i] > listTas[2*i+2]) || (listTas[i] > listTas[2*i+1])) {
      printLog("noeud ["+i+"] faux");
      nodeOk = false;
      pileOk = false;
      Pile.drawNodeXY(Pile.nodeXY[i], i, listTas[i], "#ff9078");
    }
    console.log("noeud",i,nodeOk);
  }
  var verify = document.getElementById('verifyButton');
  if (pileOk==false) {
    printLog("pas un tas");
    verify.innerHTML = ('<INPUT style="background-color: #ff9078;" type="button" value="vérifier" onClick="javascript:verifyPile()">  <span>Vérifier si la liste est un tas</span>')
  }
  else {
    printLog("est un tas");
    verify.innerHTML = ('<INPUT type="button" value="vérifier" onClick="javascript:verifyPile()">  <span>Vérifier si la liste est un tas</span>')
  }
  console.log("tas",pileOk);
}

/*--------------------------------------------------*
 *                      extractMin
 *--------------------------------------------------*
 */
 function extractMin() {
  
  printLog("extraction minimum :");
  // la liste contient plus d'un élément
  if (listTas.length > 1) {

    compteur = 0;
    // on déplace le dernier à la racine
    listTas[0] = listTas.pop();
    console.log(listTas);
    // on travail sur une copie
    tasCopy = listTas.slice();
    // on enregistre les déplacements de l'algo en l'executant à blanc
    // sur la copie  
    var n=0;
    var m;
    while (n*2+1 < tasCopy.length && tasCopy[n] > tasCopy[n*2+1]) {
      if (n*2+2<tasCopy.length && tasCopy[n*2+1]>tasCopy[n*2+2]) {
        m = n*2+2;
      }
      else {
        m = n*2+1;
      }
      var temp = tasCopy[n];
      tasCopy[n] = tasCopy[m];
      tasCopy[m] = temp;
      // enregistrement echange
      changeStep.push([m,n]);
      console.log("indice échangés",n,"<->",m); 
      n = m; 
    }
    console.log("liste changement",changeStep);
    
    // si il y'a des échanges
    if (changeStep.length > 0) {
      // on défini les 2 noeuds du premier échange
      p0 = Pile.nodeXY[changeStep[compteur][0]].slice();
      p1 = Pile.nodeXY[changeStep[compteur][1]].slice();
      // calcul du pas de déplacement
      var distance = ((p1[0]-p0[0])**2+(p1[1]-p0[1])**2)**0.5;
      vx = (p1[0]-p0[0])/distance;
      vy = (p1[1]-p0[1])/distance;
      // on lance l'animation
      raf = window.requestAnimationFrame(exchange);
    }
    Pile.refresh();
  }
  else {
    min = listTas.pop();
    Pile.refresh();
  }
 }
 
/*--------------------------------------------------*
 *                      packPile
 *--------------------------------------------------*
 */
function packPile() {
  console.log("lancement animation packPile");
  printLog("tasser tas :");
  compteur = 0;
  // on travail sur une copie
  tasCopy = listTas.slice();
  // on enregistre les déplacements de l'algo en l'executant à blanc
  // sur la copie
  
  for (var i=0; i<listTas.length/2; i++) {
    pack(((listTas.length/2)|0)-(i+1));
  }
  console.log("liste changement",changeStep);
  // si il y'a des échanges
  if (changeStep.length > 0) {
    // on défini les 2 noeuds du premier échange
    p0 = Pile.nodeXY[changeStep[compteur][0]].slice();
    p1 = Pile.nodeXY[changeStep[compteur][1]].slice();
    // calcul du pas de déplacement
    var distance = ((p1[0]-p0[0])**2+(p1[1]-p0[1])**2)**0.5;
    vx = (p1[0]-p0[0])/distance;
    vy = (p1[1]-p0[1])/distance;
    // on lance l'animation
    raf = window.requestAnimationFrame(exchange);
  }
// pas d'échange
}

/*--------------------------------------------------*
 *                      pack
 *--------------------------------------------------*
 */
function packNode() {
  console.log("lancement animation pack");
  // on récupère l'indice du noeud
  node = parseInt(document.getElementById('indexPackNode').value);
  printLog("tasser noeud :");
  // possible : le noeud existe ?
  if (node < listTas.length) {

    compteur = 0;
    // on travail sur une copie
    tasCopy = listTas.slice();
    // on enregistre les déplacements de l'algo en l'executant à blanc
    // sur la copie
    // appel de pack récursif
    pack(node);
    
    console.log("liste changement",changeStep);
      
    // si il y'a des échanges
    if (changeStep.length > 0) {
      // on défini les 2 noeuds du premier échange
      p0 = Pile.nodeXY[changeStep[compteur][0]].slice();
      p1 = Pile.nodeXY[changeStep[compteur][1]].slice();
      // calcul du pas de déplacement
      var distance = ((p1[0]-p0[0])**2+(p1[1]-p0[1])**2)**0.5;
      vx = (p1[0]-p0[0])/distance;
      vy = (p1[1]-p0[1])/distance;
      // on lance l'animation
      raf = window.requestAnimationFrame(exchange);
    }
  // pas d'échange
  }
}

function pack(index) {
  if (index*2+2 < tasCopy.length) {
    if (tasCopy[index*2+2] < tasCopy[index] && tasCopy[index*2+2] < tasCopy[index*2+1]) {
      var temp = tasCopy[index];
      tasCopy[index] = tasCopy[index*2+2];
      tasCopy[index*2+2] = temp;
      // enregistrement echange
      changeStep.push([index*2+2,index]);
      console.log("indice échangés",index,"<->",index*2+2);
      pack(index*2+2);
      return
      }
  }
  // left son
  if (index*2+1 < tasCopy.length) {
    if (tasCopy[index*2+1] < tasCopy[index]) {
      console.log(index, '<->', index*2+1);
      var temp = tasCopy[index];
      tasCopy[index] = tasCopy[index*2+1];
      tasCopy[index*2+1] = temp;
      // enregistrement echange
      changeStep.push([index*2+1,index]);
      console.log("indice échangés",index,"<->",index*2+1);
      pack(index*2+1);
      return
      }
    }
  return index
  }

/*--------------------------------------------------*
 *                     insert
 *--------------------------------------------------*
 */
function insert() {
  console.log("lancement animation insert");
  // possible si on dépasse pas la limite de liste imposée
  // et qu'on insere pas la racine (seule insertion possible sans avoir
  // à faire d'échange
  if (listTas.length < 31 && listTas.length > 0) {

    compteur = 0;
    // on insere la nouvelle valeur dans la liste
    let temp = document.getElementById('valueInsert').value;
    listTas.push(parseInt(temp));
    printLog("insertion tas :");
    printLog(temp+" -> ["+(listTas.length-1)+"]");
    List.refresh();
    // on travail sur une copie
    tasCopy = listTas.slice();
    // on enregistre les déplacements de l'algo en l'executant à blanc
    // sur la copie
      
    var n = tasCopy.length-1;
    var p = ((n-1)/2)|0;
    while (n > 0 && tasCopy[p] > tasCopy[n]) {
      // enregistrement echange
      changeStep.push([n,p]);
      console.log("indice échangés",n,"<->",p);
      let temp = tasCopy[n];
      tasCopy[n] = tasCopy[p];
      tasCopy[p] = temp;
      n = p
      p = ((n-1)/2)|0;
      
      console.log("liste changement",changeStep);  
    }
    
    // si il y'a des échanges
    if (changeStep.length > 0) {
      // on défini les 2 noeuds du premier échange
      p0 = Pile.nodeXY[changeStep[compteur][0]].slice();
      p1 = Pile.nodeXY[changeStep[compteur][1]].slice();
      // calcul du pas de déplacement
      var distance = ((p1[0]-p0[0])**2+(p1[1]-p0[1])**2)**0.5;
      vx = (p1[0]-p0[0])/distance;
      vy = (p1[1]-p0[1])/distance;
      // on lance l'animation
      raf = window.requestAnimationFrame(exchange);
    }
  }
  // si cas nouvelle racine
  if (listTas.length < 1) {
    // on met la liste à jour
    listTas.push(parseInt(document.getElementById('text').value));
  }
  // sinon rien à montrer

  Pile.refresh();
  return
}

function exchange() {
  // on efface
  ctx.clearRect(0, 0, 500, 250);
  // on dessine le décor fixe
  // dessin des liens
  for (var i =0; i < listTas.length; i++) {
    // si fils gauche
    if (i*2+1<listTas.length) {
      Pile.drawEdge(i,i*2+1);
      // si fils droit
      if  (i*2+2<listTas.length) {
        Pile.drawEdge(i,i*2+2);
      }
    }
    // on efface les liens sous les noeuds qui bougent
    if (i==changeStep[compteur][0] || i==changeStep[compteur][1]) {
      Pile.clearNodeXY(Pile.nodeXY[i]);
    }
    else {
      // on affiche les noeuds qui bougent pas
      Pile.drawNodeXY(Pile.nodeXY[i], i, listTas[i]); 
    }   
  }

  // dessin des noeuds echanges
  Pile.drawNodeXY(p0, changeStep[compteur][0], listTas[changeStep[compteur][0]], "green");
  Pile.drawNodeXY(p1, changeStep[compteur][1], listTas[changeStep[compteur][1]], "green");
  // calcul de la nouvelle position
  p0[0] += vx;
  p0[1] += vy;
  p1[0] -= vx;
  p1[1] -= vy;
  
  // gestion fin du déplacement
  // test fin déplacement
  if (p0[1] <= Pile.nodeXY[changeStep[compteur][1]][1]) {
	console.log('fin animation', compteur);
	
	// on met à jour la liste
	var temp = listTas[changeStep[compteur][0]];
	listTas[changeStep[compteur][0]] = listTas[changeStep[compteur][1]];
	listTas[changeStep[compteur][1]] = temp;
	List.refresh();
  printLog("["+changeStep[compteur][0]+"] <-> ["+changeStep[compteur][1]+"]");
	console.log('tas :', listTas);

	// on passe à l'echange suivant
	compteur += 1;
	// si il reste des echanges
	if (compteur < changeStep.length) {
	  p0 = Pile.nodeXY[changeStep[compteur][0]].slice();
	  p1 = Pile.nodeXY[changeStep[compteur][1]].slice();
	  // calcul du pas de déplacement
	  var distance = ((p1[0]-p0[0])**2+(p1[1]-p0[1])**2)**0.5;
	  vx = (p1[0]-p0[0])/distance;
	  vy = (p1[1]-p0[1])/distance;
	  // dessin des noeuds echanges
	  Pile.drawNodeXY(p0, changeStep[compteur][0], listTas[changeStep[compteur][0]]);
	  Pile.drawNodeXY(p1, changeStep[compteur][1], listTas[changeStep[compteur][1]]);
	  p0[0] += vx;
	  p0[1] += vy;
	  p1[0] -= vx;
	  p1[1] -= vy;
	  sleep(700);
	  raf = window.requestAnimationFrame(exchange);
	}
	// sinon  FIN de l'animation
	else {
	  // vide la liste des échanges
	  changeStep = [];
	  debut=true;
	  Pile.refresh();
	  console.log("fin animation");
	  return
	}  
  }
  else {
  // on continue l'animation
  raf = window.requestAnimationFrame(exchange);
  }  
}
