// Remove Redundant Frames
// bb's first figma plugin!!
// Ostin Kurniawan, 2019
// super basic JS because i don't know anything else 

// counts
var removedFramesCount = 0;

// Selection
for (var selection of figma.currentPage.selection) {
  removeRedundantFrames(selection);
  removeEmptyFrames(selection); // remove any extra empty frames
}

figma.notify("Removed " + removedFramesCount + " redundant frames.")

figma.closePlugin();

function removeRedundantFrames(currNode: any) {
  if (currNode.children.length != 0 && currNode.type === "FRAME"){
    if (currNode.children.length === 1) {
      var child = currNode.children[0];
      //ungroup
      const index = currNode.parent.children.indexOf(currNode); //save the location in the array of what is to be ungrouped
      if (currNode.parent != figma.currentPage && checkFrameIsSafeToRemove(currNode)) {
        // ungroup and maintain absolute coordinates
        const currNodeX = currNode.x;
        const currNodeY = currNode.y;
        const childX = child.x;
        const childY = child.y;
        currNode.parent.insertChild(index, child);
        child.x = currNodeX + childX;
        child.y = currNodeY + childY;
      }
      if (child.type == "FRAME") {
        removeRedundantFrames(child);
      }
    } else {
      // check children
      for (var childNode in currNode.children) {
        removeRedundantFrames(currNode.children[childNode]);
      }
    }
    if (currNode.children.length === 0 && checkFrameIsSafeToRemove(currNode)) {
      currNode.remove();
      removedFramesCount++;
    }
  }
}

function removeEmptyFrames(node: any){
  var emptyFrames = figma.currentPage.findAll(node => node.type === "FRAME" && node.children.length === 0 && checkFrameIsSafeToRemove(node));
  emptyFrames.forEach(function(frame) { frame.remove(); removedFramesCount++; });
}

function checkFrameIsSafeToRemove(currNode: FrameNode){
  var hasNoOpacityChanges = (currNode.opacity === 1); //safe if opacity is 1
  var hasNoEffects = (currNode.effects.length === 0); // safe if no blend effects 
  var hasNoBlendMode = (currNode.blendMode === "PASS_THROUGH"); //safe if blendmode is normal
  var hasNoBackgrounds = (currNode.backgrounds.length === 0) //safe if backgrounds is 0

  return hasNoOpacityChanges && hasNoEffects && hasNoBlendMode && hasNoBackgrounds;
}