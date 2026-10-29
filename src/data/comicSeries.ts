/** CilikLab original English comic series — 10 books, 80 authored story pages.
 * Artwork paths are reserved for future published comic illustrations; the
 * preview art remains visible until each page asset is supplied.
 * Malaysian editions are deliberately NOT marked published.
 */
export interface SeriesPage {index:number;narration:string;speaker:string;speech:string;code:string|null;art:string}
export interface SeriesBook {id:string;title:string;topic:string;world:string;characters:string;objective:string;description:string;cover:string;pages:SeriesPage[]}
export const COMIC_SERIES: SeriesBook[] = [
  {
    "id": "01-lost-loop",
    "title": "Ciko and the Lost Loop",
    "topic": "Loops and repetition",
    "world": "Robot Orchard",
    "characters": "Ciko, Aina, Ben",
    "objective": "Recognize repeated actions and use a counted loop.",
    "description": "Before sunset at Robot Orchard, Ciko helps Aina and Ben replace repeated apple-picking instructions with one simple loop.",
    "cover": "/comics/01-lost-loop/cover.webp",
    "pages": [
      {
        "index": 1,
        "narration": "So many apples, so little time!",
        "speaker": "Ben",
        "speech": "We need a faster plan before sunset!",
        "code": null,
        "art": "/comics/01-lost-loop/page-01.webp"
      },
      {
        "index": 2,
        "narration": "The instructions keep repeating.",
        "speaker": "Aina",
        "speech": "Do I really need to write the same step again and again?",
        "code": null,
        "art": "/comics/01-lost-loop/page-02.webp"
      },
      {
        "index": 3,
        "narration": "A loop repeats an action.",
        "speaker": "Ciko",
        "speech": "If the action repeats, a loop can help!",
        "code": null,
        "art": "/comics/01-lost-loop/page-03.webp"
      },
      {
        "index": 4,
        "narration": "One instruction can run three times.",
        "speaker": "Ciko",
        "speech": "This loop repeats the action three times.",
        "code": "for i in range(3):\n    print(\"Pick apple\")",
        "art": "/comics/01-lost-loop/page-04.webp"
      },
      {
        "index": 5,
        "narration": "Watch the loop in action!",
        "speaker": "Ben",
        "speech": "It followed our repeating plan!",
        "code": null,
        "art": "/comics/01-lost-loop/page-05.webp"
      },
      {
        "index": 6,
        "narration": "Loops make plans shorter and clearer.",
        "speaker": "Aina",
        "speech": "That is much easier to read.",
        "code": null,
        "art": "/comics/01-lost-loop/page-06.webp"
      },
      {
        "index": 7,
        "narration": "Mission completed before sunset!",
        "speaker": "Ciko",
        "speech": "Great teamwork—and one useful loop!",
        "code": null,
        "art": "/comics/01-lost-loop/page-07.webp"
      },
      {
        "index": 8,
        "narration": "Try it: what action would you repeat five times?",
        "speaker": "Ciko",
        "speech": "Remember: loops help us repeat actions.",
        "code": null,
        "art": "/comics/01-lost-loop/page-08.webp"
      }
    ]
  },
  {
    "id": "02-variable-treasure",
    "title": "The Variable Treasure Hunt",
    "topic": "Variables and updating values",
    "world": "Library treasure tunnels",
    "characters": "Ciko, Mei, Ravi",
    "objective": "Store values under names and update a value as a story changes.",
    "description": "A library map leads Mei and Ravi through a puzzle vault where labeled boxes keep track of keys, coins, and clues.",
    "cover": "/comics/02-variable-treasure/cover.webp",
    "pages": [
      {
        "index": 1,
        "narration": "A mysterious treasure map appears.",
        "speaker": "Mei",
        "speech": "It looks like the library has a secret!",
        "code": null,
        "art": "/comics/02-variable-treasure/page-01.webp"
      },
      {
        "index": 2,
        "narration": "We need to remember what we find.",
        "speaker": "Ravi",
        "speech": "How can we keep track of these items?",
        "code": null,
        "art": "/comics/02-variable-treasure/page-02.webp"
      },
      {
        "index": 3,
        "narration": "A variable is like a named box.",
        "speaker": "Ciko",
        "speech": "Give a value a name so you can find it later.",
        "code": null,
        "art": "/comics/02-variable-treasure/page-03.webp"
      },
      {
        "index": 4,
        "narration": "We can store our treasure counts.",
        "speaker": "Mei",
        "speech": "Now the computer can remember them!",
        "code": "keys = 3\ncoins = 5\nmap_piece = 1",
        "art": "/comics/02-variable-treasure/page-04.webp"
      },
      {
        "index": 5,
        "narration": "Values can change during the adventure.",
        "speaker": "Ravi",
        "speech": "Our coin count went up!",
        "code": "coins = coins + 2",
        "art": "/comics/02-variable-treasure/page-05.webp"
      },
      {
        "index": 6,
        "narration": "The stored values guide the next step.",
        "speaker": "Ciko",
        "speech": "Use the values to make a smart choice.",
        "code": null,
        "art": "/comics/02-variable-treasure/page-06.webp"
      },
      {
        "index": 7,
        "narration": "The treasure is a room of discoveries!",
        "speaker": "Mei",
        "speech": "We remembered every clue.",
        "code": null,
        "art": "/comics/02-variable-treasure/page-07.webp"
      },
      {
        "index": 8,
        "narration": "Try it: create a variable for your favorite game.",
        "speaker": "Ciko",
        "speech": "Variables keep information ready when we need it.",
        "code": null,
        "art": "/comics/02-variable-treasure/page-08.webp"
      }
    ]
  },
  {
    "id": "03-if-else-jungle",
    "title": "If-Else in the Jungle",
    "topic": "Conditions and decisions",
    "world": "Coding Jungle",
    "characters": "Ciko, Aina, Ravi",
    "objective": "Choose actions using true/false conditions and if/else.",
    "description": "Weather changes in Coding Jungle, and a pathfinding robot learns to decide between a cave route and a bridge route.",
    "cover": "/comics/03-if-else-jungle/cover.webp",
    "pages": [
      {
        "index": 1,
        "narration": "Two paths, one important decision.",
        "speaker": "Aina",
        "speech": "Which way should the robot go?",
        "code": null,
        "art": "/comics/03-if-else-jungle/page-01.webp"
      },
      {
        "index": 2,
        "narration": "The weather gives us a clue.",
        "speaker": "Ravi",
        "speech": "Rain means cave. Sunshine means bridge!",
        "code": null,
        "art": "/comics/03-if-else-jungle/page-02.webp"
      },
      {
        "index": 3,
        "narration": "A condition asks a question.",
        "speaker": "Ciko",
        "speech": "If something is true, choose one action.",
        "code": null,
        "art": "/comics/03-if-else-jungle/page-03.webp"
      },
      {
        "index": 4,
        "narration": "Use if and else to decide.",
        "speaker": "Ciko",
        "speech": "A robot can follow weather rules.",
        "code": "raining = True\nif raining:\n    print(\"Cave\")\nelse:\n    print(\"Bridge\")",
        "art": "/comics/03-if-else-jungle/page-04.webp"
      },
      {
        "index": 5,
        "narration": "When it is sunny, choose the bridge.",
        "speaker": "Aina",
        "speech": "It followed the sunshine rule!",
        "code": null,
        "art": "/comics/03-if-else-jungle/page-05.webp"
      },
      {
        "index": 6,
        "narration": "When it rains, choose the cave.",
        "speaker": "Ravi",
        "speech": "Same rules, different weather!",
        "code": null,
        "art": "/comics/03-if-else-jungle/page-06.webp"
      },
      {
        "index": 7,
        "narration": "The right choice keeps everyone on track.",
        "speaker": "Ciko",
        "speech": "Conditions help us choose wisely.",
        "code": null,
        "art": "/comics/03-if-else-jungle/page-07.webp"
      },
      {
        "index": 8,
        "narration": "Try it: what would you do if it started raining?",
        "speaker": "Ciko",
        "speech": "If and else give different answers to a question.",
        "code": null,
        "art": "/comics/03-if-else-jungle/page-08.webp"
      }
    ]
  },
  {
    "id": "04-bug-monster",
    "title": "Robo and the Bug Monster",
    "topic": "Debugging and syntax",
    "world": "Robot School workshop",
    "characters": "Ciko, Ben, Robo, friendly Bug Monster",
    "objective": "Identify an error, read feedback and correct it instead of guessing.",
    "description": "A goofy, harmless Bug Monster makes Ben’s workshop robot behave strangely until the children learn to read mistakes and fix code.",
    "cover": "/comics/04-bug-monster/cover.webp",
    "pages": [
      {
        "index": 1,
        "narration": "Meet Ben’s new helper robot.",
        "speaker": "Ben",
        "speech": "Robo can paint the class sign!",
        "code": null,
        "art": "/comics/04-bug-monster/page-01.webp"
      },
      {
        "index": 2,
        "narration": "Robo is not following the plan.",
        "speaker": "Ben",
        "speech": "That was not the picture I asked for.",
        "code": null,
        "art": "/comics/04-bug-monster/page-02.webp"
      },
      {
        "index": 3,
        "narration": "A silly bug has appeared!",
        "speaker": "Bug Monster",
        "speech": "Can you find the mistake?",
        "code": null,
        "art": "/comics/04-bug-monster/page-03.webp"
      },
      {
        "index": 4,
        "narration": "Read the error, check the line, then fix it.",
        "speaker": "Ciko",
        "speech": "Debugging means finding what went wrong.",
        "code": null,
        "art": "/comics/04-bug-monster/page-04.webp"
      },
      {
        "index": 5,
        "narration": "A missing bracket breaks the command.",
        "speaker": "Ben",
        "speech": "I forgot to close the bracket!",
        "code": "# Incorrect\nprint(\"Hello Robo\"\n\n# Correct\nprint(\"Hello Robo\")",
        "art": "/comics/04-bug-monster/page-05.webp"
      },
      {
        "index": 6,
        "narration": "Some problems take more than one try.",
        "speaker": "Ciko",
        "speech": "Let’s check carefully, one step at a time.",
        "code": null,
        "art": "/comics/04-bug-monster/page-06.webp"
      },
      {
        "index": 7,
        "narration": "Robo works after careful debugging!",
        "speaker": "Ben",
        "speech": "A mistake can teach us something useful.",
        "code": null,
        "art": "/comics/04-bug-monster/page-07.webp"
      },
      {
        "index": 8,
        "narration": "Try it: can you find a missing quote or bracket?",
        "speaker": "Ciko",
        "speech": "Great coders debug, test, and try again.",
        "code": null,
        "art": "/comics/04-bug-monster/page-08.webp"
      }
    ]
  },
  {
    "id": "05-function-factory",
    "title": "The Function Factory",
    "topic": "Functions and reuse",
    "world": "Function Factory",
    "characters": "Ciko, Mei, Teacher Hana",
    "objective": "Define a function once and call it again when needed.",
    "description": "At a friendly miniature factory, Teacher Hana and Ciko show Mei how reusable functions organize tasks like greeting, labeling and packing.",
    "cover": "/comics/05-function-factory/cover.webp",
    "pages": [
      {
        "index": 1,
        "narration": "Welcome to the Function Factory!",
        "speaker": "Teacher Hana",
        "speech": "Every station has its own job.",
        "code": null,
        "art": "/comics/05-function-factory/page-01.webp"
      },
      {
        "index": 2,
        "narration": "Each machine does a particular task.",
        "speaker": "Mei",
        "speech": "Could code have little helpers like these?",
        "code": null,
        "art": "/comics/05-function-factory/page-02.webp"
      },
      {
        "index": 3,
        "narration": "A function is a reusable set of steps.",
        "speaker": "Ciko",
        "speech": "Give a useful task a name!",
        "code": null,
        "art": "/comics/05-function-factory/page-03.webp"
      },
      {
        "index": 4,
        "narration": "Define a function once.",
        "speaker": "Teacher Hana",
        "speech": "This function prints a friendly greeting.",
        "code": "def greet():\n    print(\"Hello, CilikLab!\")",
        "art": "/comics/05-function-factory/page-04.webp"
      },
      {
        "index": 5,
        "narration": "Call the function whenever you need it.",
        "speaker": "Mei",
        "speech": "We can use the same helper again!",
        "code": "greet()\ngreet()",
        "art": "/comics/05-function-factory/page-05.webp"
      },
      {
        "index": 6,
        "narration": "Different functions organize different jobs.",
        "speaker": "Ciko",
        "speech": "Keep each job clear and easy to reuse.",
        "code": null,
        "art": "/comics/05-function-factory/page-06.webp"
      },
      {
        "index": 7,
        "narration": "The factory runs smoothly!",
        "speaker": "Mei",
        "speech": "Small reusable steps made a big difference.",
        "code": null,
        "art": "/comics/05-function-factory/page-07.webp"
      },
      {
        "index": 8,
        "narration": "Try it: what would your own function do?",
        "speaker": "Ciko",
        "speech": "Build it once, then call it again.",
        "code": null,
        "art": "/comics/05-function-factory/page-08.webp"
      }
    ]
  },
  {
    "id": "06-space-station",
    "title": "Ciko Saves the Space Station",
    "topic": "Sequencing and algorithms",
    "world": "Space Station Nova",
    "characters": "Ciko, Aina, Mei",
    "objective": "Put simple instructions in the correct order and test a sequence.",
    "description": "A training alarm aboard Space Station Nova sends the team on a playful simulated rescue: reorder the maintenance steps to restore the station systems.",
    "cover": "/comics/06-space-station/cover.webp",
    "pages": [
      {
        "index": 1,
        "narration": "The space station needs a repair plan.",
        "speaker": "Aina",
        "speech": "The training alarm is on!",
        "code": null,
        "art": "/comics/06-space-station/page-01.webp"
      },
      {
        "index": 2,
        "narration": "The repair steps are out of order.",
        "speaker": "Mei",
        "speech": "We cannot just press everything!",
        "code": null,
        "art": "/comics/06-space-station/page-02.webp"
      },
      {
        "index": 3,
        "narration": "An algorithm is a step-by-step plan.",
        "speaker": "Ciko",
        "speech": "The order of instructions matters.",
        "code": null,
        "art": "/comics/06-space-station/page-03.webp"
      },
      {
        "index": 4,
        "narration": "Testing the wrong order gives feedback.",
        "speaker": "Aina",
        "speech": "That step should come later.",
        "code": null,
        "art": "/comics/06-space-station/page-04.webp"
      },
      {
        "index": 5,
        "narration": "Let’s put the steps in a better order.",
        "speaker": "Mei",
        "speech": "Check first, then unlock, then restart.",
        "code": null,
        "art": "/comics/06-space-station/page-05.webp"
      },
      {
        "index": 6,
        "narration": "The correct sequence restores the station.",
        "speaker": "Ciko",
        "speech": "That is a working algorithm!",
        "code": null,
        "art": "/comics/06-space-station/page-06.webp"
      },
      {
        "index": 7,
        "narration": "Space Station Nova is back on track!",
        "speaker": "Aina",
        "speech": "We solved it by thinking in order.",
        "code": null,
        "art": "/comics/06-space-station/page-07.webp"
      },
      {
        "index": 8,
        "narration": "Try it: order three steps for brushing your teeth.",
        "speaker": "Ciko",
        "speech": "Every good sequence starts with a plan.",
        "code": null,
        "art": "/comics/06-space-station/page-08.webp"
      }
    ]
  },
  {
    "id": "07-python-castle",
    "title": "The Secret of Python Castle",
    "topic": "Strings and quotation marks",
    "world": "Python Castle",
    "characters": "Ciko, Ravi, Ben",
    "objective": "Understand quoted text strings and print a message.",
    "description": "A friendly enchanted castle opens its doors only when Ravi and Ben send a correctly quoted text message using Python.",
    "cover": "/comics/07-python-castle/cover.webp",
    "pages": [
      {
        "index": 1,
        "narration": "A castle with a secret awaits.",
        "speaker": "Ben",
        "speech": "How do we get through the door?",
        "code": null,
        "art": "/comics/07-python-castle/page-01.webp"
      },
      {
        "index": 2,
        "narration": "The door wants a message.",
        "speaker": "Ravi",
        "speech": "It seems to understand words!",
        "code": null,
        "art": "/comics/07-python-castle/page-02.webp"
      },
      {
        "index": 3,
        "narration": "Plain words are not always valid code.",
        "speaker": "Ciko",
        "speech": "Python needs to know that this is text.",
        "code": null,
        "art": "/comics/07-python-castle/page-03.webp"
      },
      {
        "index": 4,
        "narration": "Quotation marks tell Python it is a string.",
        "speaker": "Ciko",
        "speech": "A string holds text inside quotes.",
        "code": "print(\"Open the door\")",
        "art": "/comics/07-python-castle/page-04.webp"
      },
      {
        "index": 5,
        "narration": "The correct string unlocks the door.",
        "speaker": "Ravi",
        "speech": "The quotes made a difference!",
        "code": null,
        "art": "/comics/07-python-castle/page-05.webp"
      },
      {
        "index": 6,
        "narration": "Strings can store many different messages.",
        "speaker": "Ben",
        "speech": "We can change the words, too!",
        "code": "message = \"Hello, Ciko\"\nprint(message)",
        "art": "/comics/07-python-castle/page-06.webp"
      },
      {
        "index": 7,
        "narration": "The castle’s secret is a learning library!",
        "speaker": "Ciko",
        "speech": "Words can be data in code.",
        "code": null,
        "art": "/comics/07-python-castle/page-07.webp"
      },
      {
        "index": 8,
        "narration": "Try it: print your favorite greeting.",
        "speaker": "Ciko",
        "speech": "Text inside quotes is called a string.",
        "code": null,
        "art": "/comics/07-python-castle/page-08.webp"
      }
    ]
  },
  {
    "id": "08-robot-delivery",
    "title": "Mission: Robot Delivery",
    "topic": "Algorithms and route planning",
    "world": "Little Learning Town",
    "characters": "Ciko, Aina, Ravi, Zip the delivery robot",
    "objective": "Build precise instructions and adjust a route when it fails.",
    "description": "Little yellow delivery robot Zip must bring supplies to three places in town; the team plans and tests an exact route.",
    "cover": "/comics/08-robot-delivery/cover.webp",
    "pages": [
      {
        "index": 1,
        "narration": "Zip has three important deliveries.",
        "speaker": "Aina",
        "speech": "Let’s help Zip find the best route!",
        "code": null,
        "art": "/comics/08-robot-delivery/page-01.webp"
      },
      {
        "index": 2,
        "narration": "Vague directions cause confusion.",
        "speaker": "Ravi",
        "speech": "We forgot to tell Zip where to turn.",
        "code": null,
        "art": "/comics/08-robot-delivery/page-02.webp"
      },
      {
        "index": 3,
        "narration": "Robots need specific steps.",
        "speaker": "Ciko",
        "speech": "A clear algorithm tells what to do next.",
        "code": null,
        "art": "/comics/08-robot-delivery/page-03.webp"
      },
      {
        "index": 4,
        "narration": "Plan the full route before starting.",
        "speaker": "Aina",
        "speech": "First go forward, then turn, then deliver.",
        "code": null,
        "art": "/comics/08-robot-delivery/page-04.webp"
      },
      {
        "index": 5,
        "narration": "The first delivery is complete.",
        "speaker": "Zip",
        "speech": "Route step completed!",
        "code": null,
        "art": "/comics/08-robot-delivery/page-05.webp"
      },
      {
        "index": 6,
        "narration": "Test the plan and improve it.",
        "speaker": "Ravi",
        "speech": "We can change a step if needed.",
        "code": null,
        "art": "/comics/08-robot-delivery/page-06.webp"
      },
      {
        "index": 7,
        "narration": "All packages arrive on time!",
        "speaker": "Ciko",
        "speech": "Precise steps make reliable deliveries.",
        "code": null,
        "art": "/comics/08-robot-delivery/page-07.webp"
      },
      {
        "index": 8,
        "narration": "Try it: design a route for Zip.",
        "speaker": "Ciko",
        "speech": "Plan, follow, test, and improve.",
        "code": null,
        "art": "/comics/08-robot-delivery/page-08.webp"
      }
    ]
  },
  {
    "id": "09-maze-conditions",
    "title": "The Maze of Conditions",
    "topic": "Nested if statements and combined rules",
    "world": "Puzzle Garden Maze",
    "characters": "Ciko, Mei, Ben",
    "objective": "Evaluate two conditions in the correct order before taking an action.",
    "description": "In a friendly garden maze, doors check both a key and the robot’s energy level; Mei uses nested decisions to guide the team.",
    "cover": "/comics/09-maze-conditions/cover.webp",
    "pages": [
      {
        "index": 1,
        "narration": "Welcome to the Puzzle Garden Maze.",
        "speaker": "Ben",
        "speech": "Why are there two symbols on the door?",
        "code": null,
        "art": "/comics/09-maze-conditions/page-01.webp"
      },
      {
        "index": 2,
        "narration": "Some gates have more than one rule.",
        "speaker": "Mei",
        "speech": "We need a key and enough energy.",
        "code": null,
        "art": "/comics/09-maze-conditions/page-02.webp"
      },
      {
        "index": 3,
        "narration": "Check the first rule, then the second.",
        "speaker": "Ciko",
        "speech": "Some decisions happen inside other decisions.",
        "code": null,
        "art": "/comics/09-maze-conditions/page-03.webp"
      },
      {
        "index": 4,
        "narration": "Nested conditions test both requirements.",
        "speaker": "Ciko",
        "speech": "First check the key, then the energy.",
        "code": "has_key = True\nenergy = 8\nif has_key:\n    if energy > 5:\n        print(\"Open\")",
        "art": "/comics/09-maze-conditions/page-04.webp"
      },
      {
        "index": 5,
        "narration": "The key is not enough by itself.",
        "speaker": "Ben",
        "speech": "We still need more energy!",
        "code": null,
        "art": "/comics/09-maze-conditions/page-05.webp"
      },
      {
        "index": 6,
        "narration": "Meet both conditions before retrying.",
        "speaker": "Mei",
        "speech": "Now the second rule is true, too.",
        "code": null,
        "art": "/comics/09-maze-conditions/page-06.webp"
      },
      {
        "index": 7,
        "narration": "Both rules pass—the maze opens!",
        "speaker": "Ciko",
        "speech": "Great work checking every condition.",
        "code": null,
        "art": "/comics/09-maze-conditions/page-07.webp"
      },
      {
        "index": 8,
        "narration": "Try it: invent a door that needs two things.",
        "speaker": "Ciko",
        "speech": "Complex choices become easier step by step.",
        "code": null,
        "art": "/comics/09-maze-conditions/page-08.webp"
      }
    ]
  },
  {
    "id": "10-code-team-heroes",
    "title": "Code Team Heroes",
    "topic": "Review: loops, variables, conditions, functions and debugging",
    "world": "CilikLab Code Festival",
    "characters": "Ciko, Aina, Ben, Mei, Ravi, Teacher Hana",
    "objective": "Combine basic coding ideas and collaborate to solve a final challenge.",
    "description": "At the CilikLab Code Festival, all the children combine what they learned to complete a sequence of friendly coding challenges as a team.",
    "cover": "/comics/10-code-team-heroes/cover.webp",
    "pages": [
      {
        "index": 1,
        "narration": "The Code Festival begins today!",
        "speaker": "Teacher Hana",
        "speech": "You will need everything you have learned.",
        "code": null,
        "art": "/comics/10-code-team-heroes/page-01.webp"
      },
      {
        "index": 2,
        "narration": "Challenge one: use a loop.",
        "speaker": "Aina",
        "speech": "We can repeat the steps instead of copying them.",
        "code": null,
        "art": "/comics/10-code-team-heroes/page-02.webp"
      },
      {
        "index": 3,
        "narration": "Challenge two: track a variable.",
        "speaker": "Mei",
        "speech": "Remember the count, then update it!",
        "code": null,
        "art": "/comics/10-code-team-heroes/page-03.webp"
      },
      {
        "index": 4,
        "narration": "Challenge three: choose with if and else.",
        "speaker": "Ravi",
        "speech": "The condition decides our next action.",
        "code": null,
        "art": "/comics/10-code-team-heroes/page-04.webp"
      },
      {
        "index": 5,
        "narration": "The final challenge contains a bug!",
        "speaker": "Ben",
        "speech": "I know what to do: check it carefully.",
        "code": null,
        "art": "/comics/10-code-team-heroes/page-05.webp"
      },
      {
        "index": 6,
        "narration": "Each friend brings a different coding skill.",
        "speaker": "Ciko",
        "speech": "Teamwork makes problem solving stronger!",
        "code": null,
        "art": "/comics/10-code-team-heroes/page-06.webp"
      },
      {
        "index": 7,
        "narration": "The team finishes together!",
        "speaker": "Teacher Hana",
        "speech": "You tested, fixed, and kept learning.",
        "code": null,
        "art": "/comics/10-code-team-heroes/page-07.webp"
      },
      {
        "index": 8,
        "narration": "Your next coding adventure starts here.",
        "speaker": "Ciko",
        "speech": "Keep imagining, creating, and helping each other!",
        "code": null,
        "art": "/comics/10-code-team-heroes/page-08.webp"
      }
    ]
  }
];
export const COMIC_SERIES_IDS=new Set(COMIC_SERIES.map(book=>book.id));
