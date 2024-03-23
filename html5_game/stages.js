let main_char_dialog_idx = 0;
let sub_char_dialog_idx = 0;
let npc1_char_dialog_idx = 0;
let npc2_char_dialog_idx = 2;
let npc3_char_dialog_idx = 0;
let npc4_char_dialog_idx = 0;
let npc5_char_dialog_idx = 0;

function start_story(print_dialog, end_handler) {
  setTimeout(function() {
    print_dialog("main", main_char_dialog_idx++);
    setTimeout(function() {
      print_dialog("npc2", sub_char_dialog_idx++);
      setTimeout(function() {
        print_dialog("main", main_char_dialog_idx++);
        setTimeout(function() {
          print_dialog("npc2", sub_char_dialog_idx++);
          end_handler();
        }, 5000);
      }, 2000);
    }, 2000);
  }, 2000);
}

function stage0(interactable, print_dialog, end_handler) {
  if (interactable == 0) {
    // npc1
    game_dialog.displayHidden();
    print_dialog("npc1", 0);
    return;
  } else if (interactable == 1) {
    // npc3
    game_dialog.displayHidden();
    print_dialog("npc3", 0);
    return;
  } else if (interactable == 2) {
    // npc4
    setTimeout(
      function() {
        print_dialog("npc4", npc4_char_dialog_idx++);
        setTimeout(function() {
          print_dialog("main", main_char_dialog_idx++);
          setTimeout(function() {
            print_dialog("npc4", npc4_char_dialog_idx++);
            setTimeout(function() {
              print_dialog("main", main_char_dialog_idx++);
              setTimeout(function() {
                print_dialog("npc4", npc4_char_dialog_idx++);
                end_handler();
            }, 5000);
          }, 10000);
        }, 7000);
      }, 3000);
    }, 500);
  } else if (interactable == 3) {
    game_dialog.displayHidden();
    print_dialog("npc5", 0);
  }
}

function stage1(interactable, print_dialog, end_handler) {
  if (interactable == 0) {
    game_dialog.displayHidden();
    print_dialog("npc1", npc1_char_dialog_idx++);
    setTimeout(function() {
      print_dialog("main", main_char_dialog_idx++);
      setTimeout(function() {
        print_dialog("npc1", npc1_char_dialog_idx++);
        setTimeout(function() {
          print_dialog("main", main_char_dialog_idx++);
          setTimeout(function() {
            print_dialog("npc1", npc1_char_dialog_idx++);
            setTimeout(function() {
              print_dialog("main", main_char_dialog_idx++);
              setTimeout(function() {
                print_dialog("npc1", npc1_char_dialog_idx++);
                end_handler();
              }, 5000);
            }, 5000);
          }, 5000);
        }, 4000);
      }, 4000);
    }, 3000);
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

function stage2(interactable, print_dialog, end_handler) {
  if (interactable == 2) {
    game_dialog.displayHidden();
    print_dialog("npc4", npc4_char_dialog_idx++);
    setTimeout(function() {
      print_dialog("main", main_char_dialog_idx++);
      setTimeout(function() {
        print_dialog("npc4", npc4_char_dialog_idx++);
        setTimeout(function() {
          print_dialog("main", main_char_dialog_idx++);
          setTimeout(function() {
            print_dialog("npc4", npc4_char_dialog_idx++);
            setTimeout(function() {
              print_dialog("main", main_char_dialog_idx++);
              end_handler();
            }, 3000);
          }, 3000);
        }, 5000);
      }, 5000);
    }, 1000);
  } else if (interactable == 0) {
    game_dialog.displayHidden();
    print_dialog("npc1", 0);
  } else if (interactable == 1) {
    game_dialog.displayHidden();
    print_dialog("npc3", 0);
  } else if (interactable == 3) {
    game_dialog.displayHidden();
    print_dialog("npc5", 0);
  }
}

function stage3(interactable, print_dialog, end_handler) {
  if (interactable == 1) {
    game_dialog.displayHidden();
    print_dialog("npc3", npc3_char_dialog_idx++);
    setTimeout(function() {
      print_dialog("main", main_char_dialog_idx++);
      setTimeout(function() {
        print_dialog("npc3", npc3_char_dialog_idx++);
        setTimeout(function() {
          print_dialog("main", main_char_dialog_idx++);
          setTimeout(function() {
            print_dialog("npc3", npc3_char_dialog_idx);
            setTimeout(function() {
              print_dialog("main", main_char_dialog_idx++);
              end_handler();
            }, 3000);
          }, 3000);
        }, 5000);
      }, 3000);
    }, 3000);
  } else if (interactable == 0) {
    game_dialog.displayHidden();
    print_dialog("npc1", 0);
  } else if (interactable == 2) {
    game_dialog.displayHidden();
    print_dialog("npc4", 0);
  } else if (interactable == 3) {
    game_dialog.displayHidden();
    print_dialog("npc5", 0);
  } else if (interactable == 4) {
    game_dialog.displayHidden();
    print_dialog("system", 0);
  }
}

function stage4(interactable, print_dialog, end_handler) {
  if (interactable == 2) {
    game_dialog.displayHidden();
    print_dialog("npc4", npc4_char_dialog_idx++);
    setTimeout(function() {
      print_dialog("main", main_char_dialog_idx++);
      setTimeout(function() {
        print_dialog("npc4", npc4_char_dialog_idx++);
        end_handler();
      }, 1000);
    }, 1000);
  } else if (interactable == 0) {
    game_dialog.displayHidden();
    print_dialog("npc1", 0);
  } else if (interactable == 1) {
    game_dialog.displayHidden();
    print_dialog("npc3", 0);
  } else if (interactable == 3) {
    game_dialog.displayHidden();
    print_dialog("npc5", 0);
  }
}

function stage5(interactable, print_dialog, end_handler) {
  if (interactable == 3) {
    game_dialog.displayHidden();
    print_dialog("npc5", npc5_char_dialog_idx++);
    setTimeout(function() {
      print_dialog("main", main_char_dialog_idx++);
      setTimeout(function() {
        print_dialog("npc5", npc5_char_dialog_idx++);
        setTimeout(function() {
          print_dialog("main", main_char_dialog_idx++);
          setTimeout(function() {
            print_dialog("npc5", npc5_char_dialog_idx++);
            setTimeout(function() {
              print_dialog("main", main_char_dialog_idx++);
              end_handler();
            }, 5000);
          }, 5000);
        }, 5000);
      }, 5000);
    }, 3000); 
  } else if (interactable == 0) {
    game_dialog.displayHidden();
    print_dialog("npc1", 0);
  } else if (interactable == 1) {
    game_dialog.displayHidden();
    print_dialog("npc3", 0);
  } else if (interactable == 2) {
    game_dialog.displayHidden();
    print_dialog("npc4", 0);
  }
}

function stage6(interactable, print_dialog, end_handler) {
  if (interactable == 2) {
    game_dialog.displayHidden();
    print_dialog("npc4", npc4_char_dialog_idx++);
    setTimeout(function() {
      print_dialog("main", main_char_dialog_idx++);
      setTimeout(function() {
        print_dialog("npc4", npc4_char_dialog_idx++);
        setTimeout(function() {
          print_dialog("main", main_char_dialog_idx++);
          setTimeout(function() {
            print_dialog("npc4", npc4_char_dialog_idx++);
            setTimeout(function() {
              print_dialog("main", main_char_dialog_idx++);
              setTimeout(function() {
                print_dialog("npc4", npc4_char_dialog_idx++);
                end_handler();
              }, 3000);
            }, 5000);
          }, 5000);
        }, 7000);
      }, 5000);
    }, 5000);
  } else if (interactable == 0) {
    game_dialog.displayHidden();
    print_dialog("npc1", 0);
  } else if (interactable == 1) {
    game_dialog.displayHidden();
    print_dialog("npc3", 0);
  } else if (interactable == 3) {
    game_dialog.displayHidden();
    print_dialog("npc5", 0);
  }
}

function stage6_2(print_dialog, end_handler) {
  game_dialog.displayHidden();
  print_dialog("npc2", npc2_char_dialog_idx++);
  setTimeout(function() {
    print_dialog("main", main_char_dialog_idx++);
    setTimeout(function() {
      print_dialog("npc2", npc2_char_dialog_idx++);
      setTimeout(function() {
        print_dialog("main", main_char_dialog_idx++);
        setTimeout(function() {
          print_dialog("npc2", npc2_char_dialog_idx++);
          setTimeout(function() {
            print_dialog("main", main_char_dialog_idx++);
            setTimeout(function() {
              print_dialog("npc2", npc2_char_dialog_idx++);
              end_handler();
            }, 3000);
          }, 5000);
        }, 3000);
      }, 7000);
    }, 7000);
  }, 5000);

}
