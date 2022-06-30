import { world, BlockLocation, Block } from "mojang-minecraft";

var valid_blocks = ["minecraft:log", "minecraft:log2", "minecraft:mangrove_log", "minecraft:warped_stem", "minecraft:crimson_stem"];

function recursion_search(currentBlock, queue, count){
  if (queue.length <= 0) {
    print(queue.length);
    print("returned");
    return;
  }

  currentBlock = queue.shift();
  world.getDimension("overworld").runCommand(`setblock ${currentBlock.location.x} ${currentBlock.location.y} ${currentBlock.location.z} glass 0`);
  let direction =  world.getDimension("overworld");
  
  // Diagonals
  let block_up_left = direction.getBlock(new BlockLocation(currentBlock.location.x + 1, currentBlock.location.y + 1, currentBlock.location.z));
  let block_up_right = direction.getBlock(new BlockLocation(currentBlock.location.x - 1, currentBlock.location.y + 1, currentBlock.location.z));
  let block_down_right = direction.getBlock(new BlockLocation(currentBlock.location.x - 1, currentBlock.location.y - 1, currentBlock.location.z));
  let block_down_left = direction.getBlock(new BlockLocation(currentBlock.location.x + 1, currentBlock.location.y - 1, currentBlock.location.z));

  // Manhattan
  let block_above = direction.getBlock(new BlockLocation(currentBlock.location.x, currentBlock.location.y + 1, currentBlock.location.z));
  let block_left = direction.getBlock(new BlockLocation(currentBlock.location.x + 1, currentBlock.location.y, currentBlock.location.z));
  let block_right = direction.getBlock(new BlockLocation(currentBlock.location.x - 1, currentBlock.location.y, currentBlock.location.z));
  let block_below = direction.getBlock(new BlockLocation(currentBlock.location.x, currentBlock.location.y - 1, currentBlock.location.z));
  
  if (valid_blocks.includes(block_above.id)) {
    queue.push(block_above);
  }

  else if (valid_blocks.includes(block_left.id)) {
    queue.push(block_left);
  }
  
  else if (valid_blocks.includes(block_right.id)) {
    queue.push(block_right);
  }
  
  else if (valid_blocks.includes(block_below.id)) {
    queue.push(block_below);
  }

  print(count);
  

  return recursion_search(currentBlock, queue, count + 1);
}

function startSearch(root){

  // If you touched a log.
  if (valid_blocks.includes(root.id)) {
    let queue = [];
    queue.push(root);
    recursion_search(queue[0], queue, 0);
    world.getDimension("overworld").runCommand(`say Done ${queue.length}`);
  }
}

function testerStick(player, held_item, location){
  if(held_item == "yn:tester_stick"){
    let block = world.getDimension(player.dimension.id).getBlock(new BlockLocation(location[0], location[1], location[2]));
    let id = block.id;
    startSearch(block);
  }
}

// Utility Debugger
function print(x){
world.getDimension("overworld").runCommand(`say ${x}`);
}

world.events.beforeItemUseOn.subscribe((useOn) =>{
     let player = useOn.source;
     let locations = [
        useOn.blockLocation.x,
        useOn.blockLocation.y,
        useOn.blockLocation.z
     ];
     let held_item = useOn.item.id;
     testerStick(player, held_item, locations);
});