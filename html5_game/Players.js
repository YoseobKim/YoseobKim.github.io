const player_speed = 100;

function createAnims(scene, name) {
  console.log(scene);
  var anims = scene.anims;
  anims.create({
    key: name + "-left-walk",
    frames: anims.generateFrameNames(name,
      { prefix: "left-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: name + "-right-walk",
    frames: anims.generateFrameNames(name,
      { prefix: "right-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: name + "-front-walk",
    frames: anims.generateFrameNames(name,
      { prefix: "front-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: name + "-back-walk",
    frames: anims.generateFrameNames(name,
      { prefix: "back-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
}

function character_init(scene, name, worldLayer, spawnPoint, shouldFollow) {
  // Create a sprite with physics enabled via the physics system. The image used for the sprite has
  // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
  var player = scene.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, name, "front")
    .setSize(20, 30)
    .setOffset(6, 0);

  // Watch the player and worldLayer for collisions, for the duration of the scene:
  scene.physics.add.collider(player, worldLayer);

  // Create the player's walking animations from the texture atlas. These are stored in the global
  // animation manager so any sprite can access them.
  createAnims(scene, name);

  if (shouldFollow) {
    const camera = scene.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  this.pos = spawnPoint;
  this.name = name;
  this.player = player;
}

function collision_check(map, other_players) {
  var _player = this.player;

  // map outside
  if (_player.x <= 10) {
    _player.body.setVelocity(0);
    _player.x = 10.1;
    return false;
  }
  if (_player.y <= 10) {
    _player.body.setVelocity(0);
    _player.y = 10.1;
    return false;
  }
  if (_player.x >= map.widthInPixels - 10) {
    _player.body.setVelocity(0);
    _player.y = map.widthInPixels - 10.1;
    return false;
  }
  if (_player.y >= map.heightInPixels - 10) {
    _player.body.setVelocity(0);
    _player.y = map.heightInPixels - 10.1;
    return false;
  }

  return true;
}

function move_player_inner(_this, direction) {
  var _player = _this.player;
  const prevVelocity = _player.body.velocity.clone();

  // Stop any previous movement from the last frame
  _player.body.setVelocity(0);

  // Horizontal movement
  if (direction["left"]) {
    _player.body.setVelocityX(-player_speed);
  } else if (direction["right"]) {
    _player.body.setVelocityX(player_speed);
  }

  // Vertical movement
  if (direction["up"]) {
    _player.body.setVelocityY(-player_speed);
  } else if (direction["down"]) {
    _player.body.setVelocityY(player_speed);
  }

  // Normalize and scale the velocity so that _player can't move faster along a diagonal
  _player.body.velocity.normalize().scale(player_speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (direction["left"]) {
    _player.anims.play(_this.name + "-left-walk", true);
  } else if (direction["right"]) {
    _player.anims.play(_this.name + "-right-walk", true);
  } else if (direction["up"]) {
    _player.anims.play(_this.name + "-back-walk", true);
  } else if (direction["down"]) {
    _player.anims.play(_this.name + "-front-walk", true);
  } else {
    _player.anims.stop();

    // If we were moving, pick and idle frame to use
    if (prevVelocity.x < 0) _player.setTexture(_this.name, "left");
    else if (prevVelocity.x > 0) _player.setTexture(_this.name, "right");
    else if (prevVelocity.y < 0) _player.setTexture(_this.name, "back");
    else if (prevVelocity.y > 0) _player.setTexture(_this.name, "front");
  }
  _this.pos = {x: _player.x, y: _player.y};
}

function move_player(direction) {
  move_player_inner(this, direction);
}

function follow_player(direction) {
  var _player = this.player;
  _player.x = player_character.player.x - 30;
  _player.y = player_character.player.y;
  move_player_inner(this, direction);
}

function random_move() {
  // 1. Move or not
  let move_or_not = Math.floor(Math.random() * 3);
  let direction = {};
  if (move_or_not == 0) {
    // 2. Change direction or not
    let change_or_not = Math.floor(Math.random() * 40);
    if (change_or_not != 0) {
      return this.prev_dir;
    }
    // 3. In case of change, Which way? 
    let which_way = Math.floor(Math.random() * 4);
    if (which_way == 0) direction["up"] = true;
    else if (which_way == 1) direction["down"] = true;
    else if (which_way == 2) direction["left"] = true;
    else direction["right"] = true;
    this.prev_dir = direction;
  }
  return direction;
}

function interact(interact_pos) {
  var _player = this.player;
  for (var i = 0; i < interact_pos.length; i++) {
    let npc_pos = interact_pos[i];
    let player_x = Math.floor(_player.x);
    let player_y = Math.floor(_player.y);
    let npc_x = Math.floor(npc_pos.x);
    let npc_y = Math.floor(npc_pos.y);
    const box_size = 50;
    if (npc_x - box_size <= player_x && npc_x + box_size >= player_x) {
      if (npc_y - box_size <= player_y && npc_y + box_size >= player_y) {
        return i;
      }
    }
  }
  return -1;
}

const player_character = {
  player: {},
  name:"",
  pos: {},
  init: character_init,
  collision_check: collision_check,
  prev_dir: {},
  random_move: function(){ return null; },
  move_player: move_player,
  interaction: interact
}

const npc1_character = {
  player: {},
  name: "",
  pos: {},
  init: character_init,
  collision_check: collision_check,
  prev_dir: {},
  random_move: function(){ return null; },
  move_player: move_player,
  interaction: interact
}

const npc2_character = {
  player: {},
  name: "",
  pos: {},
  init: character_init,
  collision_check: collision_check,
  prev_dir: {},
  random_move: function(){ return null; },
  move_player: follow_player,
  interaction: interact
}

const npc3_character = {
  player: {},
  name: "",
  pos: {},
  init: character_init,
  collision_check: collision_check,
  prev_dir: {},
  random_move: function(){ return null; },
  move_player: move_player,
  interaction: interact
}

const npc4_character = {
  player: {},
  name: "",
  pos: {},
  init: character_init,
  collision_check: collision_check,
  prev_dir: {},
  random_move: random_move,
  move_player: move_player,
  interaction: interact
}

const npc5_character = {
  player: {},
  name: "",
  pos: {},
  init: character_init,
  collision_check: collision_check,
  prev_dir: {},
  random_move: function(){ return null; },
  move_player: move_player,
  interaction: interact
}

const movable_chars = [player_character, npc2_character, npc4_character];
