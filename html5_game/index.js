/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Tuxemon, https://github.com/Tuxemon/Tuxemon
 */

// Globals
let cursors;
let map;
let scene;

let game_start = false;
let tutorial_ends = false;
let tutorial_dialog_idx = 0;

let joystick;
var joystick_move_direction = { x: "stop", y: "stop", angle: "stop" };

let npc1_spawnPoint;
let npc2_spawnPoint;
let npc3_spawnPoint;
let npc4_spawnPoint;
let npc5_spawnPoint;
let flowerPoint;
let hiddenPoint;

function print_dialog(who, dialog_id) {
  game_dialog.displayHidden();
  game_dialog.displayTypingEffect(dialogs[who]["name"],
    dialogs[who]["dialogs"][dialog_id], 50);
}

let stage = 0;
let update_stop = false;
let conversation_done = false;

function keyEnterHandler() {
  if (!game_start && !tutorial_ends) {
    // Tutorial messages
    game_start = true;
    setTimeout(function() {
      print_dialog("tutorial", tutorial_dialog_idx++);
    }, 1000);
  } else {
    let args = [npc1_spawnPoint, // book seller
      npc3_spawnPoint, // item seller
      npc4_character.player, // professor
      npc5_spawnPoint, // potion seller
      flowerPoint, // flower
      hiddenPoint]; // hidden item
    let interactable = player_character.interaction(args);
    if (interactable != -1) {
      if (!tutorial_ends) {
       print_dialog("tutorial", tutorial_dialog_idx++);
       tutorial_ends = true;
       // starts self dialog
       update_stop = true;

       start_story(print_dialog, function() { update_stop = false});
      } else if (!update_stop) {
        if (stage == 0) {
          if (interactable == 2) {
            update_stop = true;
            // starts self dialog
            stage0(interactable, print_dialog, function() {
              update_stop = false;
              stage++;
            });
          } else {
            stage0(interactable, print_dialog, function() { });
          }
        } else if (stage == 1) {
          if (interactable == 0) {
            update_stop = true;
            // starts self dialog
            stage1(interactable, print_dialog, function() {
              update_stop = false;
              stage++;
            });
          } else {
             stage1(interactable, print_dialog, function() { });
          }
        } else if (stage == 2) {
          if (interactable == 2) {
            update_stop = true;
            // starts self dialog
            stage2(interactable, print_dialog, function() {
              update_stop = false;
              stage++;
            });
          } else {
             stage2(interactable, print_dialog, function() { });
          }
        } else if (stage == 3) {
          if (interactable == 1 && !conversation_done) {
            update_stop = true;
            // starts self dialog
            stage3(interactable, print_dialog, function() {
              update_stop = false;
              conversation_done = true;
            });
          } else if (interactable == 4) {
            //flower
            if (conversation_done) {
              print_dialog("system", 0);
              stage++;
              conversation_done = false;
            }
          } else {
             if (interactable != 1) {
               stage3(interactable, print_dialog, function() { });
             }
          }
        } else if (stage == 4) {
          if (interactable == 2) {
            update_stop = true;
            // starts self dialog
            stage4(interactable, print_dialog, function() {
              update_stop = false;
              stage++;
            });
          } else {
             stage4(interactable, print_dialog, function() { });
          }
        } else if (stage == 5) {
          if (interactable == 3) {
            update_stop = true;
            // starts self dialog
            stage5(interactable, print_dialog, function() {
              update_stop = false;
              stage++;
            });
          } else {
             stage5(interactable, print_dialog, function() { });
          }
        } else if (stage == 6) {
          if (interactable == 2) {
            update_stop = true;
            // starts self dialog
            stage6(interactable, print_dialog, function() {
              // change texture and anim
              npc2_character.player.setTexture("Npc2_2", "front");
              createAnims(scene, "Npc2_2");
              npc2_character.name = "Npc2_2";

              setTimeout(stage6_2(print_dialog, function() {
                update_stop = false;
                stage++;
              }), 10000);
            });
          } else {
             stage6(interactable, print_dialog, function() { });
          }
        } else if (stage == 7) {
           if (interactable == 5) {
             game_dialog.displayHidden();
             print_dialog("system", 1);
             let btn = document.getElementById("dialog-btn");
             btn.innerText = "뭔지 보러갈까?";
             btn.onclick = function() {
               window.location.href = "/giftbox.html";
             };
           } else if (interactable == 0) {
             game_dialog.displayHidden();
             print_dialog("npc1", 0);
           } else if (interactable == 1) {
             game_dialog.displayHidden();
             print_dialog("npc3", 0);
           } else if (interactable == 2) {
             game_dialog.displayHidden();
             print_dialog("npc4", 0);
           } else if (interactable == 3) {
             game_dialog.displayHidden();
             print_dialog("npc5", 0);
           }
        }
      }
    }
  }
}

let joystick_handlers = {
  "start_handler": function(evt, data) {
    keyEnterHandler();
  },
  "end_handler": function(evt, data) {
    joystick_move_direction = { x: "stop", y: "stop", angle: "stop" };
  },
  "move_handler": function(evt, data) {
    joystick_move_direction = data.direction;
  },
  "dir_handler": function (evt, data) {
  },
  "pressure_handler": function (evt, data) {
  }
};

let dialogs = {}

function main() {
  var game_container = document.getElementById('game-container');
  const zoom_level = 1.5;
  var game_width = game_container.clientWidth * (1.0 / zoom_level);
  var game_height = game_container.clientHeight * (1.0 / zoom_level);
  game_width = game_width > 1000 ? 1000 : game_width;
  game_height = game_height > 1000 ? 1000 : game_height;

  // Loading dialog
  fetch('./assets/dialogs/dialog.json')
    .then((response) => response.json())
    .then((json) => dialogs = json);

  const config = {
    type: Phaser.AUTO,
    width: game_width,
    height: game_height,
    parent: game_container.id,
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    },
    scale : {zoom: zoom_level}
  };

  const game = new Phaser.Game(config);
}

function preload() {
  this.load.image("tiles", "assets/tilesets/tuxmon-sample-32px-extruded.png");
  this.load.tilemapTiledJSON("map", "assets/tilemaps/tuxemon-town2.json");

  // Load characters
  this.load.atlas("Player",
    "assets/atlas/Player.png",
    "assets/atlas/atlas.json");
  this.load.atlas("Npc1",
    "assets/atlas/Npc1.png",
    "assets/atlas/atlas.json");
  this.load.atlas("Npc2",
    "assets/atlas/Npc2.png",
    "assets/atlas/atlas.json");
  this.load.atlas("Npc3",
    "assets/atlas/Npc3.png",
    "assets/atlas/atlas.json");
  this.load.atlas("Npc4",
    "assets/atlas/Npc4.png",
    "assets/atlas/atlas.json");
  this.load.atlas("Npc5",
    "assets/atlas/Npc5.png",
    "assets/atlas/atlas.json");
  this.load.atlas("Npc2_2",
    "assets/atlas/Npc2_2.png",
    "assets/atlas/atlas.json");
}

function create() {
  map = this.make.tilemap({ key: "map" });
  scene = this;

  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
  const worldLayer = map.createLayer("World", tileset, 0, 0);
  const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);

  // By default, everything gets depth sorted on the screen in the order we created things. Here, we
  // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
  // Higher depths will sit on top of lower depth objects.
  aboveLayer.setDepth(10);

  worldLayer.setCollisionByProperty({ collides: true });

  // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
  // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
  const spawnPoint = map.findObject("Objects",
    obj => obj.name === "Spawn Point");
  npc1_spawnPoint = map.findObject("Objects",
    obj => obj.name === "NPC1 Spawn Point");
  npc2_spawnPoint = map.findObject("Objects",
    obj => obj.name === "NPC2 Spawn Point");
  npc3_spawnPoint = map.findObject("Objects",
    obj => obj.name === "NPC3 Spawn Point");
  npc4_spawnPoint = map.findObject("Objects",
    obj => obj.name === "NPC4 Spawn Point");
  npc5_spawnPoint = map.findObject("Objects",
    obj => obj.name === "NPC5 Spawn Point");
  flowerPoint = map.findObject("Objects",
    obj => obj.name === "Flower Point");
  hiddenPoint = map.findObject("Objects",
    obj => obj.name === "Hidden Point");

  // Initialize Characters
  // init(scene, name, worldLayer, spawnPoint, shouldFollow)
  player_character.init(this, "Player", worldLayer, spawnPoint, true);
  npc1_character.init(this, "Npc1", worldLayer, npc1_spawnPoint, false);
  npc2_character.init(this, "Npc2", worldLayer, npc2_spawnPoint, false);
  npc3_character.init(this, "Npc3", worldLayer, npc3_spawnPoint, false);
  npc4_character.init(this, "Npc4", worldLayer, npc4_spawnPoint, false);
  npc5_character.init(this, "Npc5", worldLayer, npc5_spawnPoint, false);

  cursors = this.input.keyboard.createCursorKeys();
  this.input.keyboard.addKey("ENTER").on("down", function(event) {
    keyEnterHandler();
  })

  // Debug graphics
  this.input.keyboard.once("keydown-D", event => {
    // Turn on physics debugging to show player's hitbox
    this.physics.world.createDebugGraphic();

    // Create worldLayer collision graphic above the player, but below the help text
    const graphics = this.add
      .graphics()
      .setAlpha(0.75)
      .setDepth(20);
    worldLayer.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
  });

  // Virtual joystick
  joystick = nipplejs.create({
    zone: document.getElementById('joystick'),
    color: 'white'
  });
  joystick.on('start', joystick_handlers["start_handler"]);
  joystick.on('end', joystick_handlers["end_handler"]);
  joystick.on('move', joystick_handlers["move_handler"]);
  joystick.on('dir:up ' +
              'plain:up ' +
              'dir:left ' +
              'plain:left ' +
              'dir:down ' +
              'plain:down ' +
              'dir:right ' +
              'plain:right', joystick_handlers["dir_handler"]);
  joystick.on('pressure', joystick_handlers["pressure_handler"]);

  // Dialog output (1. tutorial)
  print_dialog("tutorial", tutorial_dialog_idx++);
}

function handle_userinput() {
  let direction = {};

  if (joystick_move_direction == null)
    joystick_move_direction = { x: "stop", y: "stop", angle: "stop" };
  // Horizontal movement
  if (cursors.left.isDown ||
        joystick_move_direction.angle == "left") {
    direction["left"] = true;
  } else if (cursors.right.isDown ||
        joystick_move_direction.angle == "right") {
    direction["right"] = true;
  }

  // Vertical movement
  if (cursors.up.isDown ||
        joystick_move_direction.angle == "up") {
    direction["up"] = true;
  } else if (cursors.down.isDown ||
        joystick_move_direction.angle == "down") {
    direction["down"] = true;
  }
  return direction;
}

function update(time, delta) {
  if (update_stop) return;
  let user_direction = handle_userinput();
  let players = [player_character, npc1_character,
    npc2_character, npc3_character];
  let other_players = [];

  for (var i = 0; i < movable_chars.length; i++) {
    movable = movable_chars[i];
    for (var j = 0; j < players.length; j++) {
      other = players[j];
      if (other.name != movable.name) other_players.push(other); 
    }
    random = movable.random_move();
    decided = {};
    if (random != null) decided = random;
    else decided = user_direction;
    // Move player
    if (!movable.collision_check(map, other_players)) continue;
    movable.move_player(decided);
  }
}

