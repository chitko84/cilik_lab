# CilikLab — English Comic Flipbook Scripts

These are the exact English narration, dialogue and optional Python examples embedded in the 10 live web flipbooks. All art is currently preview art and should be replaced with approved comic illustrations from the art production plan.

## 01. Ciko and the Lost Loop

**Concept:** Loops and repetition
**Learning goal:** Recognize repeated actions and use a counted loop.
**Story:** Before sunset at Robot Orchard, Ciko helps Aina and Ben replace repeated apple-picking instructions with one simple loop.

### Page 01
So many apples, so little time!
**Ben:** “We need a faster plan before sunset!”

### Page 02
The instructions keep repeating.
**Aina:** “Do I really need to write the same step again and again?”

### Page 03
A loop repeats an action.
**Ciko:** “If the action repeats, a loop can help!”

### Page 04
One instruction can run three times.
**Ciko:** “This loop repeats the action three times.”

```python
for i in range(3):
    print("Pick apple")
```

### Page 05
Watch the loop in action!
**Ben:** “It followed our repeating plan!”

### Page 06
Loops make plans shorter and clearer.
**Aina:** “That is much easier to read.”

### Page 07
Mission completed before sunset!
**Ciko:** “Great teamwork—and one useful loop!”

### Page 08
Try it: what action would you repeat five times?
**Ciko:** “Remember: loops help us repeat actions.”

## 02. The Variable Treasure Hunt

**Concept:** Variables and updating values
**Learning goal:** Store values under names and update a value as a story changes.
**Story:** A library map leads Mei and Ravi through a puzzle vault where labeled boxes keep track of keys, coins, and clues.

### Page 01
A mysterious treasure map appears.
**Mei:** “It looks like the library has a secret!”

### Page 02
We need to remember what we find.
**Ravi:** “How can we keep track of these items?”

### Page 03
A variable is like a named box.
**Ciko:** “Give a value a name so you can find it later.”

### Page 04
We can store our treasure counts.
**Mei:** “Now the computer can remember them!”

```python
keys = 3
coins = 5
map_piece = 1
```

### Page 05
Values can change during the adventure.
**Ravi:** “Our coin count went up!”

```python
coins = coins + 2
```

### Page 06
The stored values guide the next step.
**Ciko:** “Use the values to make a smart choice.”

### Page 07
The treasure is a room of discoveries!
**Mei:** “We remembered every clue.”

### Page 08
Try it: create a variable for your favorite game.
**Ciko:** “Variables keep information ready when we need it.”

## 03. If-Else in the Jungle

**Concept:** Conditions and decisions
**Learning goal:** Choose actions using true/false conditions and if/else.
**Story:** Weather changes in Coding Jungle, and a pathfinding robot learns to decide between a cave route and a bridge route.

### Page 01
Two paths, one important decision.
**Aina:** “Which way should the robot go?”

### Page 02
The weather gives us a clue.
**Ravi:** “Rain means cave. Sunshine means bridge!”

### Page 03
A condition asks a question.
**Ciko:** “If something is true, choose one action.”

### Page 04
Use if and else to decide.
**Ciko:** “A robot can follow weather rules.”

```python
raining = True
if raining:
    print("Cave")
else:
    print("Bridge")
```

### Page 05
When it is sunny, choose the bridge.
**Aina:** “It followed the sunshine rule!”

### Page 06
When it rains, choose the cave.
**Ravi:** “Same rules, different weather!”

### Page 07
The right choice keeps everyone on track.
**Ciko:** “Conditions help us choose wisely.”

### Page 08
Try it: what would you do if it started raining?
**Ciko:** “If and else give different answers to a question.”

## 04. Robo and the Bug Monster

**Concept:** Debugging and syntax
**Learning goal:** Identify an error, read feedback and correct it instead of guessing.
**Story:** A goofy, harmless Bug Monster makes Ben’s workshop robot behave strangely until the children learn to read mistakes and fix code.

### Page 01
Meet Ben’s new helper robot.
**Ben:** “Robo can paint the class sign!”

### Page 02
Robo is not following the plan.
**Ben:** “That was not the picture I asked for.”

### Page 03
A silly bug has appeared!
**Bug Monster:** “Can you find the mistake?”

### Page 04
Read the error, check the line, then fix it.
**Ciko:** “Debugging means finding what went wrong.”

### Page 05
A missing bracket breaks the command.
**Ben:** “I forgot to close the bracket!”

```python
# Incorrect
print("Hello Robo"

# Correct
print("Hello Robo")
```

### Page 06
Some problems take more than one try.
**Ciko:** “Let’s check carefully, one step at a time.”

### Page 07
Robo works after careful debugging!
**Ben:** “A mistake can teach us something useful.”

### Page 08
Try it: can you find a missing quote or bracket?
**Ciko:** “Great coders debug, test, and try again.”

## 05. The Function Factory

**Concept:** Functions and reuse
**Learning goal:** Define a function once and call it again when needed.
**Story:** At a friendly miniature factory, Teacher Hana and Ciko show Mei how reusable functions organize tasks like greeting, labeling and packing.

### Page 01
Welcome to the Function Factory!
**Teacher Hana:** “Every station has its own job.”

### Page 02
Each machine does a particular task.
**Mei:** “Could code have little helpers like these?”

### Page 03
A function is a reusable set of steps.
**Ciko:** “Give a useful task a name!”

### Page 04
Define a function once.
**Teacher Hana:** “This function prints a friendly greeting.”

```python
def greet():
    print("Hello, CilikLab!")
```

### Page 05
Call the function whenever you need it.
**Mei:** “We can use the same helper again!”

```python
greet()
greet()
```

### Page 06
Different functions organize different jobs.
**Ciko:** “Keep each job clear and easy to reuse.”

### Page 07
The factory runs smoothly!
**Mei:** “Small reusable steps made a big difference.”

### Page 08
Try it: what would your own function do?
**Ciko:** “Build it once, then call it again.”

## 06. Ciko Saves the Space Station

**Concept:** Sequencing and algorithms
**Learning goal:** Put simple instructions in the correct order and test a sequence.
**Story:** A training alarm aboard Space Station Nova sends the team on a playful simulated rescue: reorder the maintenance steps to restore the station systems.

### Page 01
The space station needs a repair plan.
**Aina:** “The training alarm is on!”

### Page 02
The repair steps are out of order.
**Mei:** “We cannot just press everything!”

### Page 03
An algorithm is a step-by-step plan.
**Ciko:** “The order of instructions matters.”

### Page 04
Testing the wrong order gives feedback.
**Aina:** “That step should come later.”

### Page 05
Let’s put the steps in a better order.
**Mei:** “Check first, then unlock, then restart.”

### Page 06
The correct sequence restores the station.
**Ciko:** “That is a working algorithm!”

### Page 07
Space Station Nova is back on track!
**Aina:** “We solved it by thinking in order.”

### Page 08
Try it: order three steps for brushing your teeth.
**Ciko:** “Every good sequence starts with a plan.”

## 07. The Secret of Python Castle

**Concept:** Strings and quotation marks
**Learning goal:** Understand quoted text strings and print a message.
**Story:** A friendly enchanted castle opens its doors only when Ravi and Ben send a correctly quoted text message using Python.

### Page 01
A castle with a secret awaits.
**Ben:** “How do we get through the door?”

### Page 02
The door wants a message.
**Ravi:** “It seems to understand words!”

### Page 03
Plain words are not always valid code.
**Ciko:** “Python needs to know that this is text.”

### Page 04
Quotation marks tell Python it is a string.
**Ciko:** “A string holds text inside quotes.”

```python
print("Open the door")
```

### Page 05
The correct string unlocks the door.
**Ravi:** “The quotes made a difference!”

### Page 06
Strings can store many different messages.
**Ben:** “We can change the words, too!”

```python
message = "Hello, Ciko"
print(message)
```

### Page 07
The castle’s secret is a learning library!
**Ciko:** “Words can be data in code.”

### Page 08
Try it: print your favorite greeting.
**Ciko:** “Text inside quotes is called a string.”

## 08. Mission: Robot Delivery

**Concept:** Algorithms and route planning
**Learning goal:** Build precise instructions and adjust a route when it fails.
**Story:** Little yellow delivery robot Zip must bring supplies to three places in town; the team plans and tests an exact route.

### Page 01
Zip has three important deliveries.
**Aina:** “Let’s help Zip find the best route!”

### Page 02
Vague directions cause confusion.
**Ravi:** “We forgot to tell Zip where to turn.”

### Page 03
Robots need specific steps.
**Ciko:** “A clear algorithm tells what to do next.”

### Page 04
Plan the full route before starting.
**Aina:** “First go forward, then turn, then deliver.”

### Page 05
The first delivery is complete.
**Zip:** “Route step completed!”

### Page 06
Test the plan and improve it.
**Ravi:** “We can change a step if needed.”

### Page 07
All packages arrive on time!
**Ciko:** “Precise steps make reliable deliveries.”

### Page 08
Try it: design a route for Zip.
**Ciko:** “Plan, follow, test, and improve.”

## 09. The Maze of Conditions

**Concept:** Nested if statements and combined rules
**Learning goal:** Evaluate two conditions in the correct order before taking an action.
**Story:** In a friendly garden maze, doors check both a key and the robot’s energy level; Mei uses nested decisions to guide the team.

### Page 01
Welcome to the Puzzle Garden Maze.
**Ben:** “Why are there two symbols on the door?”

### Page 02
Some gates have more than one rule.
**Mei:** “We need a key and enough energy.”

### Page 03
Check the first rule, then the second.
**Ciko:** “Some decisions happen inside other decisions.”

### Page 04
Nested conditions test both requirements.
**Ciko:** “First check the key, then the energy.”

```python
has_key = True
energy = 8
if has_key:
    if energy > 5:
        print("Open")
```

### Page 05
The key is not enough by itself.
**Ben:** “We still need more energy!”

### Page 06
Meet both conditions before retrying.
**Mei:** “Now the second rule is true, too.”

### Page 07
Both rules pass—the maze opens!
**Ciko:** “Great work checking every condition.”

### Page 08
Try it: invent a door that needs two things.
**Ciko:** “Complex choices become easier step by step.”

## 10. Code Team Heroes

**Concept:** Review: loops, variables, conditions, functions and debugging
**Learning goal:** Combine basic coding ideas and collaborate to solve a final challenge.
**Story:** At the CilikLab Code Festival, all the children combine what they learned to complete a sequence of friendly coding challenges as a team.

### Page 01
The Code Festival begins today!
**Teacher Hana:** “You will need everything you have learned.”

### Page 02
Challenge one: use a loop.
**Aina:** “We can repeat the steps instead of copying them.”

### Page 03
Challenge two: track a variable.
**Mei:** “Remember the count, then update it!”

### Page 04
Challenge three: choose with if and else.
**Ravi:** “The condition decides our next action.”

### Page 05
The final challenge contains a bug!
**Ben:** “I know what to do: check it carefully.”

### Page 06
Each friend brings a different coding skill.
**Ciko:** “Teamwork makes problem solving stronger!”

### Page 07
The team finishes together!
**Teacher Hana:** “You tested, fixed, and kept learning.”

### Page 08
Your next coding adventure starts here.
**Ciko:** “Keep imagining, creating, and helping each other!”
