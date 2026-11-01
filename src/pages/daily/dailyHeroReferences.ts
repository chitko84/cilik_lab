/** Reference solutions for automated validation only, not bundled into the application. */
export const HERO_REFERENCE_SOLUTIONS:Record<string,{c:string;java:string}> = {
 "daily-151": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    puts(\"HERO READY\");\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"HERO READY\");\n    }\n}"
 },
 "daily-152": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 10 + 4);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(10 + 4);\n    }\n}"
 },
 "daily-153": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 17 - 5);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(17 - 5);\n    }\n}"
 },
 "daily-154": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 6 * 14);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(6 * 14);\n    }\n}"
 },
 "daily-155": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", (16+7) % 6);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println((16+7) % 6);\n    }\n}"
 },
 "daily-156": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 36 / 2);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(36 / 2);\n    }\n}"
 },
 "daily-157": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int i = 1; i < 7; i++) {\n        total += i;\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int i = 1; i < 7; i++) {\n            total += i;\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-158": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int battery = 22;\n    if (battery >= 30) {\n        puts(\"Launch\");\n    }\n    else {\n        puts(\"Charge\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int battery = 22;\n        if (battery >= 30) {\n            System.out.println(\"Launch\");\n        }\n        else {\n            System.out.println(\"Charge\");\n        }\n    }\n}"
 },
 "daily-159": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i < 9; i++) {\n        printf(\"%d\\n\", i);\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i < 9; i++) {\n            System.out.println(i);\n        }\n    }\n}"
 },
 "daily-160": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int round = 0; round < 8; round++) {\n        score += 26;\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int round = 0; round < 8; round++) {\n            score += 26;\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-161": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int i = 1; i < 16; i++) {\n        if (i % 2 == 0) {\n            total += i;\n        }\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int i = 1; i < 16; i++) {\n            if (i % 2 == 0) {\n                total += i;\n            }\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-162": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int count = 0;\n    for (int i = 1; i < 24; i++) {\n        if (i % 3 == 0) {\n            count += 1;\n        }\n    }\n    printf(\"%d\\n\", count);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int count = 0;\n        for (int i = 1; i < 24; i++) {\n            if (i % 3 == 0) {\n                count += 1;\n            }\n        }\n        System.out.println(count);\n    }\n}"
 },
 "daily-163": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int sensors = 0;\n    for (int row = 0; row < 6; row++) {\n        for (int column = 0; column < 9; column++) {\n            sensors += 1;\n        }\n    }\n    printf(\"%d\\n\", sensors);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int sensors = 0;\n        for (int row = 0; row < 6; row++) {\n            for (int column = 0; column < 9; column++) {\n                sensors += 1;\n            }\n        }\n        System.out.println(sensors);\n    }\n}"
 },
 "daily-164": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 45;\n    if (score >= 60) {\n        puts(\"Legend\");\n    }\n    else {\n        if (score >= 30) {\n            puts(\"Hero\");\n        }\n        else {\n            puts(\"Trainee\");\n        }\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 45;\n        if (score >= 60) {\n            System.out.println(\"Legend\");\n        }\n        else {\n            if (score >= 30) {\n                System.out.println(\"Hero\");\n            }\n            else {\n                System.out.println(\"Trainee\");\n            }\n        }\n    }\n}"
 },
 "daily-165": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int supply = 32;\n    int capacity = 9;\n    printf(\"%d\\n\", (supply + capacity - 1) / capacity);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int supply = 32;\n        int capacity = 9;\n        System.out.println((supply + capacity - 1) / capacity);\n    }\n}"
 },
 "daily-166": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 33 / 3);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(33 / 3);\n    }\n}"
 },
 "daily-167": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 13;\n    score += 6;\n    score -= 4;\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 13;\n        score += 6;\n        score -= 4;\n        System.out.println(score);\n    }\n}"
 },
 "daily-168": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int charge = 15;\n    if (charge >= 12) {\n        puts(\"Shield\");\n    }\n    else {\n        puts(\"Recharge\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int charge = 15;\n        if (charge >= 12) {\n            System.out.println(\"Shield\");\n        }\n        else {\n            System.out.println(\"Recharge\");\n        }\n    }\n}"
 },
 "daily-169": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 17 + 8 + 6);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(17 + 8 + 6);\n    }\n}"
 },
 "daily-170": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 2 * 19;\n    total += 9;\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 2 * 19;\n        total += 9;\n        System.out.println(total);\n    }\n}"
 },
 "daily-171": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    puts(\"Ready\");\n    puts(\"Power\");\n    puts(\"Go\");\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Ready\");\n        System.out.println(\"Power\");\n        System.out.println(\"Go\");\n    }\n}"
 },
 "daily-172": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int round = 0; round < 6; round++) {\n        score += 23;\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int round = 0; round < 6; round++) {\n            score += 23;\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-173": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int badge = 29;\n    if (badge % 2 == 0) {\n        puts(\"Even\");\n    }\n    else {\n        puts(\"Odd\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int badge = 29;\n        if (badge % 2 == 0) {\n            System.out.println(\"Even\");\n        }\n        else {\n            System.out.println(\"Odd\");\n        }\n    }\n}"
 },
 "daily-174": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int energy = 8;\n    for (int i = 0; i < 8; i++) {\n        energy += 5;\n    }\n    printf(\"%d\\n\", energy);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int energy = 8;\n        for (int i = 0; i < 8; i++) {\n            energy += 5;\n        }\n        System.out.println(energy);\n    }\n}"
 },
 "daily-175": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int power = 10;\n    for (int i = 0; i < 3; i++) {\n        power *= 2;\n    }\n    printf(\"%d\\n\", power);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int power = 10;\n        for (int i = 0; i < 3; i++) {\n            power *= 2;\n        }\n        System.out.println(power);\n    }\n}"
 },
 "daily-176": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int points = 0;\n    for (int round = 1; round < 9; round++) {\n        points += 7;\n        if (round % 2 == 0) {\n            points += 12;\n        }\n    }\n    printf(\"%d\\n\", points);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int points = 0;\n        for (int round = 1; round < 9; round++) {\n            points += 7;\n            if (round % 2 == 0) {\n                points += 12;\n            }\n        }\n        System.out.println(points);\n    }\n}"
 },
 "daily-177": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int energy = 22;\n    int safe = 0;\n    for (int round = 0; round < 9; round++) {\n        if (energy >= 16) {\n            safe += 1;\n        }\n        energy -= 8;\n    }\n    printf(\"%d\\n\", safe);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int energy = 22;\n        int safe = 0;\n        for (int round = 0; round < 9; round++) {\n            if (energy >= 16) {\n                safe += 1;\n            }\n            energy -= 8;\n        }\n        System.out.println(safe);\n    }\n}"
 },
 "daily-178": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int level = 1; level < 11; level++) {\n        score += level * level;\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int level = 1; level < 11; level++) {\n            score += level * level;\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-179": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int energy = 54;\n    for (int round = 0; round < 9; round++) {\n        energy -= 10;\n    }\n    if (energy >= 18) {\n        puts(\"Safe\");\n    }\n    else {\n        puts(\"Recharge\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int energy = 54;\n        for (int round = 0; round < 9; round++) {\n            energy -= 10;\n        }\n        if (energy >= 18) {\n            System.out.println(\"Safe\");\n        }\n        else {\n            System.out.println(\"Recharge\");\n        }\n    }\n}"
 },
 "daily-180": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int mission = 1; mission < 27; mission++) {\n        if (mission % 3 == 0) {\n            score += mission;\n        }\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int mission = 1; mission < 27; mission++) {\n            if (mission % 3 == 0) {\n                score += mission;\n            }\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-181": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    puts(\"Ready\");\n    puts(\"Power\");\n    puts(\"Go\");\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Ready\");\n        System.out.println(\"Power\");\n        System.out.println(\"Go\");\n    }\n}"
 },
 "daily-182": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int meter = 16;\n    meter += 8;\n    meter *= 2;\n    printf(\"%d\\n\", meter);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int meter = 16;\n        meter += 8;\n        meter *= 2;\n        System.out.println(meter);\n    }\n}"
 },
 "daily-183": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    puts(\"HERO READY\");\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"HERO READY\");\n    }\n}"
 },
 "daily-184": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 20 + 10);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(20 + 10);\n    }\n}"
 },
 "daily-185": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 25 - 3);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(25 - 3);\n    }\n}"
 },
 "daily-186": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 4 * 24);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(4 * 24);\n    }\n}"
 },
 "daily-187": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int power = 26;\n    for (int i = 0; i < 3; i++) {\n        power *= 2;\n    }\n    printf(\"%d\\n\", power);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int power = 26;\n        for (int i = 0; i < 3; i++) {\n            power *= 2;\n        }\n        System.out.println(power);\n    }\n}"
 },
 "daily-188": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int first = 9;\n    int second = 13;\n    if (first >= second) {\n        printf(\"%d\\n\", first);\n    }\n    else {\n        printf(\"%d\\n\", second);\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int first = 9;\n        int second = 13;\n        if (first >= second) {\n            System.out.println(first);\n        }\n        else {\n            System.out.println(second);\n        }\n    }\n}"
 },
 "daily-189": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    for (int i = 0; i < 4; i++) {\n        puts(\"Check passed\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 4; i++) {\n            System.out.println(\"Check passed\");\n        }\n    }\n}"
 },
 "daily-190": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", (13+8) / 3);\n    printf(\"%d\\n\", (13+8) % 3);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println((13+8) / 3);\n        System.out.println((13+8) % 3);\n    }\n}"
 },
 "daily-191": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int tokens = 0;\n    for (int i = 1; i < 9; i++) {\n        tokens += 15;\n        if (i % 2 == 0) {\n            tokens += 9;\n        }\n    }\n    printf(\"%d\\n\", tokens);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int tokens = 0;\n        for (int i = 1; i < 9; i++) {\n            tokens += 15;\n            if (i % 2 == 0) {\n                tokens += 9;\n            }\n        }\n        System.out.println(tokens);\n    }\n}"
 },
 "daily-192": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int row = 1; row < 9; row++) {\n        for (int column = 0; column < 12; column++) {\n            if (row % 2 == 0) {\n                total += 2;\n            }\n            else {\n                total += 1;\n            }\n        }\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int row = 1; row < 9; row++) {\n            for (int column = 0; column < 12; column++) {\n                if (row % 2 == 0) {\n                    total += 2;\n                }\n                else {\n                    total += 1;\n                }\n            }\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-193": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int power = 19;\n    for (int i = 0; i < 11; i++) {\n        power += 3;\n        if (power > 28) {\n            int power = 28;\n        }\n    }\n    printf(\"%d\\n\", power);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int power = 19;\n        for (int i = 0; i < 11; i++) {\n            power += 3;\n            if (power > 28) {\n                int power = 28;\n            }\n        }\n        System.out.println(power);\n    }\n}"
 },
 "daily-194": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int best = 21;\n    if (best < 13) {\n        int best = 13;\n    }\n    if (best < 14) {\n        int best = 14;\n    }\n    printf(\"%d\\n\", best);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int best = 21;\n        if (best < 13) {\n            int best = 13;\n        }\n        if (best < 14) {\n            int best = 14;\n        }\n        System.out.println(best);\n    }\n}"
 },
 "daily-195": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int shield = 23;\n    for (int i = 1; i < 8; i++) {\n        shield += 5;\n        if (i % 3 == 0) {\n            shield -= 2;\n        }\n    }\n    printf(\"%d\\n\", shield);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int shield = 23;\n        for (int i = 1; i < 8; i++) {\n            shield += 5;\n            if (i % 3 == 0) {\n                shield -= 2;\n            }\n        }\n        System.out.println(shield);\n    }\n}"
 },
 "daily-196": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 9 * 17);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(9 * 17);\n    }\n}"
 },
 "daily-197": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", (19+10) % 6);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println((19+10) % 6);\n    }\n}"
 },
 "daily-198": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 42 / 2);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(42 / 2);\n    }\n}"
 },
 "daily-199": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 23;\n    score += 4;\n    score -= 3;\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 23;\n        score += 4;\n        score -= 3;\n        System.out.println(score);\n    }\n}"
 },
 "daily-200": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int charge = 25;\n    if (charge >= 10) {\n        puts(\"Shield\");\n    }\n    else {\n        puts(\"Recharge\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int charge = 25;\n        if (charge >= 10) {\n            System.out.println(\"Shield\");\n        }\n        else {\n            System.out.println(\"Recharge\");\n        }\n    }\n}"
 },
 "daily-201": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 8 + 6 + 5);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(8 + 6 + 5);\n    }\n}"
 },
 "daily-202": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", (10+7) / 6);\n    printf(\"%d\\n\", (10+7) % 6);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println((10+7) / 6);\n        System.out.println((10+7) % 6);\n    }\n}"
 },
 "daily-203": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    for (int i = 0; i < 6; i++) {\n        printf(\"%d\\n\", 6 - i);\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 6; i++) {\n            System.out.println(6 - i);\n        }\n    }\n}"
 },
 "daily-204": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int points = 14 + 9 - 3;\n    if (points >= 23) {\n        puts(\"Ready\");\n    }\n    else {\n        puts(\"Practice\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int points = 14 + 9 - 3;\n        if (points >= 23) {\n            System.out.println(\"Ready\");\n        }\n        else {\n            System.out.println(\"Practice\");\n        }\n    }\n}"
 },
 "daily-205": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int i = 1; i < 8; i++) {\n        total += i;\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int i = 1; i < 8; i++) {\n            total += i;\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-206": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int points = 0;\n    for (int round = 1; round < 11; round++) {\n        if (round % 2 == 0) {\n            points += 18;\n        }\n        else {\n            points += 3;\n        }\n    }\n    if (points > 63) {\n        puts(\"Super\");\n    }\n    else {\n        puts(\"Training\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int points = 0;\n        for (int round = 1; round < 11; round++) {\n            if (round % 2 == 0) {\n                points += 18;\n            }\n            else {\n                points += 3;\n            }\n        }\n        if (points > 63) {\n            System.out.println(\"Super\");\n        }\n        else {\n            System.out.println(\"Training\");\n        }\n    }\n}"
 },
 "daily-207": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int stop = 1; stop < 11; stop++) {\n        int reward = stop + 4;\n        if (stop % 3 == 0) {\n            reward *= 2;\n        }\n        total += reward;\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int stop = 1; stop < 11; stop++) {\n            int reward = stop + 4;\n            if (stop % 3 == 0) {\n                reward *= 2;\n            }\n            total += reward;\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-208": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 22;\n    for (int i = 1; i < 8; i++) {\n        score += 5;\n        if (i % 4 == 0) {\n            score += 22;\n        }\n    }\n    if (score >= 79) {\n        puts(\"Champion\");\n    }\n    else {\n        puts(\"Keep Training\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 22;\n        for (int i = 1; i < 8; i++) {\n            score += 5;\n            if (i % 4 == 0) {\n                score += 22;\n            }\n        }\n        if (score >= 79) {\n            System.out.println(\"Champion\");\n        }\n        else {\n            System.out.println(\"Keep Training\");\n        }\n    }\n}"
 },
 "daily-209": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int i = 1; i < 31; i++) {\n        if (i % 2 == 0) {\n            total += i;\n        }\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int i = 1; i < 31; i++) {\n            if (i % 2 == 0) {\n                total += i;\n            }\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-210": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int count = 0;\n    for (int i = 1; i < 39; i++) {\n        if (i % 4 == 0) {\n            count += 1;\n        }\n    }\n    printf(\"%d\\n\", count);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int count = 0;\n        for (int i = 1; i < 39; i++) {\n            if (i % 4 == 0) {\n                count += 1;\n            }\n        }\n        System.out.println(count);\n    }\n}"
 },
 "daily-211": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 20 + 3 + 6);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(20 + 3 + 6);\n    }\n}"
 },
 "daily-212": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 2 * 22;\n    total += 4;\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 2 * 22;\n        total += 4;\n        System.out.println(total);\n    }\n}"
 },
 "daily-213": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    puts(\"Ready\");\n    puts(\"Power\");\n    puts(\"Go\");\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Ready\");\n        System.out.println(\"Power\");\n        System.out.println(\"Go\");\n    }\n}"
 },
 "daily-214": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int meter = 26;\n    meter += 6;\n    meter *= 2;\n    printf(\"%d\\n\", meter);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int meter = 26;\n        meter += 6;\n        meter *= 2;\n        System.out.println(meter);\n    }\n}"
 },
 "daily-215": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    puts(\"HERO READY\");\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"HERO READY\");\n    }\n}"
 },
 "daily-216": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 11 + 8);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(11 + 8);\n    }\n}"
 },
 "daily-217": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int i = 1; i < 6; i++) {\n        total += i;\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int i = 1; i < 6; i++) {\n            total += i;\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-218": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int battery = 15;\n    if (battery >= 30) {\n        puts(\"Launch\");\n    }\n    else {\n        puts(\"Charge\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int battery = 15;\n        if (battery >= 30) {\n            System.out.println(\"Launch\");\n        }\n        else {\n            System.out.println(\"Charge\");\n        }\n    }\n}"
 },
 "daily-219": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i < 8; i++) {\n        printf(\"%d\\n\", i);\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i < 8; i++) {\n            System.out.println(i);\n        }\n    }\n}"
 },
 "daily-220": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int round = 0; round < 7; round++) {\n        score += 19;\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int round = 0; round < 7; round++) {\n            score += 19;\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-221": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int sensors = 0;\n    for (int row = 0; row < 8; row++) {\n        for (int column = 0; column < 7; column++) {\n            sensors += 1;\n        }\n    }\n    printf(\"%d\\n\", sensors);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int sensors = 0;\n        for (int row = 0; row < 8; row++) {\n            for (int column = 0; column < 7; column++) {\n                sensors += 1;\n            }\n        }\n        System.out.println(sensors);\n    }\n}"
 },
 "daily-222": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 69;\n    if (score >= 60) {\n        puts(\"Legend\");\n    }\n    else {\n        if (score >= 30) {\n            puts(\"Hero\");\n        }\n        else {\n            puts(\"Trainee\");\n        }\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 69;\n        if (score >= 60) {\n            System.out.println(\"Legend\");\n        }\n        else {\n            if (score >= 30) {\n                System.out.println(\"Hero\");\n            }\n            else {\n                System.out.println(\"Trainee\");\n            }\n        }\n    }\n}"
 },
 "daily-223": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int supply = 35;\n    int capacity = 6;\n    printf(\"%d\\n\", (supply + capacity - 1) / capacity);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int supply = 35;\n        int capacity = 6;\n        System.out.println((supply + capacity - 1) / capacity);\n    }\n}"
 },
 "daily-224": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int points = 0;\n    for (int round = 1; round < 10; round++) {\n        points += 8;\n        if (round % 2 == 0) {\n            points += 8;\n        }\n    }\n    printf(\"%d\\n\", points);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int points = 0;\n        for (int round = 1; round < 10; round++) {\n            points += 8;\n            if (round % 2 == 0) {\n                points += 8;\n            }\n        }\n        System.out.println(points);\n    }\n}"
 },
 "daily-225": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int energy = 19;\n    int safe = 0;\n    for (int round = 0; round < 10; round++) {\n        if (energy >= 18) {\n            safe += 1;\n        }\n        energy -= 9;\n    }\n    printf(\"%d\\n\", safe);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int energy = 19;\n        int safe = 0;\n        for (int round = 0; round < 10; round++) {\n            if (energy >= 18) {\n                safe += 1;\n            }\n            energy -= 9;\n        }\n        System.out.println(safe);\n    }\n}"
 },
 "daily-226": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 23 + 5);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(23 + 5);\n    }\n}"
 },
 "daily-227": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 31 - 6);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(31 - 6);\n    }\n}"
 },
 "daily-228": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 7 * 8);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(7 * 8);\n    }\n}"
 },
 "daily-229": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", (10+8) % 5);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println((10+8) % 5);\n    }\n}"
 },
 "daily-230": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 72 / 6);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(72 / 6);\n    }\n}"
 },
 "daily-231": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int round = 0; round < 4; round++) {\n        score += 14;\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int round = 0; round < 4; round++) {\n            score += 14;\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-232": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int badge = 19;\n    if (badge % 2 == 0) {\n        puts(\"Even\");\n    }\n    else {\n        puts(\"Odd\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int badge = 19;\n        if (badge % 2 == 0) {\n            System.out.println(\"Even\");\n        }\n        else {\n            System.out.println(\"Odd\");\n        }\n    }\n}"
 },
 "daily-233": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int energy = 18;\n    for (int i = 0; i < 6; i++) {\n        energy += 4;\n    }\n    printf(\"%d\\n\", energy);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int energy = 18;\n        for (int i = 0; i < 6; i++) {\n            energy += 4;\n        }\n        System.out.println(energy);\n    }\n}"
 },
 "daily-234": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int power = 20;\n    for (int i = 0; i < 3; i++) {\n        power *= 2;\n    }\n    printf(\"%d\\n\", power);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int power = 20;\n        for (int i = 0; i < 3; i++) {\n            power *= 2;\n        }\n        System.out.println(power);\n    }\n}"
 },
 "daily-235": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int level = 1; level < 12; level++) {\n        score += level * level;\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int level = 1; level < 12; level++) {\n            score += level * level;\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-236": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int energy = 72;\n    for (int round = 0; round < 5; round++) {\n        energy -= 7;\n    }\n    if (energy >= 24) {\n        puts(\"Safe\");\n    }\n    else {\n        puts(\"Recharge\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int energy = 72;\n        for (int round = 0; round < 5; round++) {\n            energy -= 7;\n        }\n        if (energy >= 24) {\n            System.out.println(\"Safe\");\n        }\n        else {\n            System.out.println(\"Recharge\");\n        }\n    }\n}"
 },
 "daily-237": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int mission = 1; mission < 33; mission++) {\n        if (mission % 8 == 0) {\n            score += mission;\n        }\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int mission = 1; mission < 33; mission++) {\n            if (mission % 8 == 0) {\n                score += mission;\n            }\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-238": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int tokens = 0;\n    for (int i = 1; i < 9; i++) {\n        tokens += 9;\n        if (i % 2 == 0) {\n            tokens += 9;\n        }\n    }\n    printf(\"%d\\n\", tokens);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int tokens = 0;\n        for (int i = 1; i < 9; i++) {\n            tokens += 9;\n            if (i % 2 == 0) {\n                tokens += 9;\n            }\n        }\n        System.out.println(tokens);\n    }\n}"
 },
 "daily-239": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int row = 1; row < 9; row++) {\n        for (int column = 0; column < 12; column++) {\n            if (row % 2 == 0) {\n                total += 2;\n            }\n            else {\n                total += 1;\n            }\n        }\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int row = 1; row < 9; row++) {\n            for (int column = 0; column < 12; column++) {\n                if (row % 2 == 0) {\n                    total += 2;\n                }\n                else {\n                    total += 1;\n                }\n            }\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-240": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int power = 13;\n    for (int i = 0; i < 11; i++) {\n        power += 3;\n        if (power > 22) {\n            int power = 22;\n        }\n    }\n    printf(\"%d\\n\", power);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int power = 13;\n        for (int i = 0; i < 11; i++) {\n            power += 3;\n            if (power > 22) {\n                int power = 22;\n            }\n        }\n        System.out.println(power);\n    }\n}"
 },
 "daily-241": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 26;\n    score += 7;\n    score -= 3;\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 26;\n        score += 7;\n        score -= 3;\n        System.out.println(score);\n    }\n}"
 },
 "daily-242": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int charge = 9;\n    if (charge >= 13) {\n        puts(\"Shield\");\n    }\n    else {\n        puts(\"Recharge\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int charge = 9;\n        if (charge >= 13) {\n            System.out.println(\"Shield\");\n        }\n        else {\n            System.out.println(\"Recharge\");\n        }\n    }\n}"
 },
 "daily-243": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 11 + 9 + 5);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(11 + 9 + 5);\n    }\n}"
 },
 "daily-244": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 6 * 13;\n    total += 10;\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 6 * 13;\n        total += 10;\n        System.out.println(total);\n    }\n}"
 },
 "daily-245": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    puts(\"Ready\");\n    puts(\"Power\");\n    puts(\"Go\");\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Ready\");\n        System.out.println(\"Power\");\n        System.out.println(\"Go\");\n    }\n}"
 },
 "daily-246": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int power = 17;\n    for (int i = 0; i < 3; i++) {\n        power *= 2;\n    }\n    printf(\"%d\\n\", power);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int power = 17;\n        for (int i = 0; i < 3; i++) {\n            power *= 2;\n        }\n        System.out.println(power);\n    }\n}"
 },
 "daily-247": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int first = 19;\n    int second = 12;\n    if (first >= second) {\n        printf(\"%d\\n\", first);\n    }\n    else {\n        printf(\"%d\\n\", second);\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int first = 19;\n        int second = 12;\n        if (first >= second) {\n            System.out.println(first);\n        }\n        else {\n            System.out.println(second);\n        }\n    }\n}"
 },
 "daily-248": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    for (int i = 0; i < 7; i++) {\n        puts(\"Check passed\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 7; i++) {\n            System.out.println(\"Check passed\");\n        }\n    }\n}"
 },
 "daily-249": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", (23+7) / 6);\n    printf(\"%d\\n\", (23+7) % 6);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println((23+7) / 6);\n        System.out.println((23+7) % 6);\n    }\n}"
 },
 "daily-250": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int power = 25;\n    for (int i = 0; i < 7; i++) {\n        power += 8;\n        if (power > 49) {\n            int power = 49;\n        }\n    }\n    printf(\"%d\\n\", power);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int power = 25;\n        for (int i = 0; i < 7; i++) {\n            power += 8;\n            if (power > 49) {\n                int power = 49;\n            }\n        }\n        System.out.println(power);\n    }\n}"
 },
 "daily-251": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int best = 8;\n    if (best < 18) {\n        int best = 18;\n    }\n    if (best < 15) {\n        int best = 15;\n    }\n    printf(\"%d\\n\", best);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int best = 8;\n        if (best < 18) {\n            int best = 18;\n        }\n        if (best < 15) {\n            int best = 15;\n        }\n        System.out.println(best);\n    }\n}"
 },
 "daily-252": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int shield = 10;\n    for (int i = 1; i < 9; i++) {\n        shield += 10;\n        if (i % 3 == 0) {\n            shield -= 2;\n        }\n    }\n    printf(\"%d\\n\", shield);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int shield = 10;\n        for (int i = 1; i < 9; i++) {\n            shield += 10;\n            if (i % 3 == 0) {\n                shield -= 2;\n            }\n        }\n        System.out.println(shield);\n    }\n}"
 },
 "daily-253": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int points = 0;\n    for (int round = 1; round < 11; round++) {\n        if (round % 2 == 0) {\n            points += 12;\n        }\n        else {\n            points += 3;\n        }\n    }\n    if (points > 45) {\n        puts(\"Super\");\n    }\n    else {\n        puts(\"Training\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int points = 0;\n        for (int round = 1; round < 11; round++) {\n            if (round % 2 == 0) {\n                points += 12;\n            }\n            else {\n                points += 3;\n            }\n        }\n        if (points > 45) {\n            System.out.println(\"Super\");\n        }\n        else {\n            System.out.println(\"Training\");\n        }\n    }\n}"
 },
 "daily-254": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int stop = 1; stop < 11; stop++) {\n        int reward = stop + 4;\n        if (stop % 3 == 0) {\n            reward *= 2;\n        }\n        total += reward;\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int stop = 1; stop < 11; stop++) {\n            int reward = stop + 4;\n            if (stop % 3 == 0) {\n                reward *= 2;\n            }\n            total += reward;\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-255": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 16;\n    for (int i = 1; i < 8; i++) {\n        score += 5;\n        if (i % 4 == 0) {\n            score += 16;\n        }\n    }\n    if (score >= 67) {\n        puts(\"Champion\");\n    }\n    else {\n        puts(\"Keep Training\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 16;\n        for (int i = 1; i < 8; i++) {\n            score += 5;\n            if (i % 4 == 0) {\n                score += 16;\n            }\n        }\n        if (score >= 67) {\n            System.out.println(\"Champion\");\n        }\n        else {\n            System.out.println(\"Keep Training\");\n        }\n    }\n}"
 },
 "daily-256": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int meter = 10;\n    meter += 9;\n    meter *= 2;\n    printf(\"%d\\n\", meter);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int meter = 10;\n        meter += 9;\n        meter *= 2;\n        System.out.println(meter);\n    }\n}"
 },
 "daily-257": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    puts(\"HERO READY\");\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"HERO READY\");\n    }\n}"
 },
 "daily-258": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 14 + 3);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(14 + 3);\n    }\n}"
 },
 "daily-259": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 20 - 4);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(20 - 4);\n    }\n}"
 },
 "daily-260": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 5 * 18);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(5 * 18);\n    }\n}"
 },
 "daily-261": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", (20+6) / 4);\n    printf(\"%d\\n\", (20+6) % 4);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println((20+6) / 4);\n        System.out.println((20+6) % 4);\n    }\n}"
 },
 "daily-262": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    for (int i = 0; i < 9; i++) {\n        printf(\"%d\\n\", 9 - i);\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 9; i++) {\n            System.out.println(9 - i);\n        }\n    }\n}"
 },
 "daily-263": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int points = 24 + 8 - 6;\n    if (points >= 32) {\n        puts(\"Ready\");\n    }\n    else {\n        puts(\"Practice\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int points = 24 + 8 - 6;\n        if (points >= 32) {\n            System.out.println(\"Ready\");\n        }\n        else {\n            System.out.println(\"Practice\");\n        }\n    }\n}"
 },
 "daily-264": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int i = 1; i < 6; i++) {\n        total += i;\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int i = 1; i < 6; i++) {\n            total += i;\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-265": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 9;\n    for (int i = 1; i < 9; i++) {\n        score += 10;\n        if (i % 4 == 0) {\n            score += 9;\n        }\n    }\n    if (score >= 98) {\n        puts(\"Champion\");\n    }\n    else {\n        puts(\"Keep Training\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 9;\n        for (int i = 1; i < 9; i++) {\n            score += 10;\n            if (i % 4 == 0) {\n                score += 9;\n            }\n        }\n        if (score >= 98) {\n            System.out.println(\"Champion\");\n        }\n        else {\n            System.out.println(\"Keep Training\");\n        }\n    }\n}"
 },
 "daily-266": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int i = 1; i < 18; i++) {\n        if (i % 2 == 0) {\n            total += i;\n        }\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int i = 1; i < 18; i++) {\n            if (i % 2 == 0) {\n                total += i;\n            }\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-267": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int count = 0;\n    for (int i = 1; i < 26; i++) {\n        if (i % 5 == 0) {\n            count += 1;\n        }\n    }\n    printf(\"%d\\n\", count);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int count = 0;\n        for (int i = 1; i < 26; i++) {\n            if (i % 5 == 0) {\n                count += 1;\n            }\n        }\n        System.out.println(count);\n    }\n}"
 },
 "daily-268": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int sensors = 0;\n    for (int row = 0; row < 8; row++) {\n        for (int column = 0; column < 7; column++) {\n            sensors += 1;\n        }\n    }\n    printf(\"%d\\n\", sensors);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int sensors = 0;\n        for (int row = 0; row < 8; row++) {\n            for (int column = 0; column < 7; column++) {\n                sensors += 1;\n            }\n        }\n        System.out.println(sensors);\n    }\n}"
 },
 "daily-269": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 51;\n    if (score >= 60) {\n        puts(\"Legend\");\n    }\n    else {\n        if (score >= 30) {\n            puts(\"Hero\");\n        }\n        else {\n            puts(\"Trainee\");\n        }\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 51;\n        if (score >= 60) {\n            System.out.println(\"Legend\");\n        }\n        else {\n            if (score >= 30) {\n                System.out.println(\"Hero\");\n            }\n            else {\n                System.out.println(\"Trainee\");\n            }\n        }\n    }\n}"
 },
 "daily-270": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int supply = 29;\n    int capacity = 6;\n    printf(\"%d\\n\", (supply + capacity - 1) / capacity);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int supply = 29;\n        int capacity = 6;\n        System.out.println((supply + capacity - 1) / capacity);\n    }\n}"
 },
 "daily-271": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", (13+3) % 5);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println((13+3) % 5);\n    }\n}"
 },
 "daily-272": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 90 / 6);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(90 / 6);\n    }\n}"
 },
 "daily-273": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 17;\n    score += 5;\n    score -= 2;\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 17;\n        score += 5;\n        score -= 2;\n        System.out.println(score);\n    }\n}"
 },
 "daily-274": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int charge = 19;\n    if (charge >= 11) {\n        puts(\"Shield\");\n    }\n    else {\n        puts(\"Recharge\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int charge = 19;\n        if (charge >= 11) {\n            System.out.println(\"Shield\");\n        }\n        else {\n            System.out.println(\"Recharge\");\n        }\n    }\n}"
 },
 "daily-275": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 21 + 7 + 4);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(21 + 7 + 4);\n    }\n}"
 },
 "daily-276": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int i = 1; i < 9; i++) {\n        total += i;\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int i = 1; i < 9; i++) {\n            total += i;\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-277": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int battery = 25;\n    if (battery >= 27) {\n        puts(\"Launch\");\n    }\n    else {\n        puts(\"Charge\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int battery = 25;\n        if (battery >= 27) {\n            System.out.println(\"Launch\");\n        }\n        else {\n            System.out.println(\"Charge\");\n        }\n    }\n}"
 },
 "daily-278": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i < 6; i++) {\n        printf(\"%d\\n\", i);\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i < 6; i++) {\n            System.out.println(i);\n        }\n    }\n}"
 },
 "daily-279": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int round = 0; round < 5; round++) {\n        score += 10;\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int round = 0; round < 5; round++) {\n            score += 10;\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-280": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int supply = 20;\n    int capacity = 7;\n    printf(\"%d\\n\", (supply + capacity - 1) / capacity);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int supply = 20;\n        int capacity = 7;\n        System.out.println((supply + capacity - 1) / capacity);\n    }\n}"
 },
 "daily-281": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int points = 0;\n    for (int round = 1; round < 11; round++) {\n        points += 5;\n        if (round % 2 == 0) {\n            points += 14;\n        }\n    }\n    printf(\"%d\\n\", points);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int points = 0;\n        for (int round = 1; round < 11; round++) {\n            points += 5;\n            if (round % 2 == 0) {\n                points += 14;\n            }\n        }\n        System.out.println(points);\n    }\n}"
 },
 "daily-282": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int energy = 22;\n    int safe = 0;\n    for (int round = 0; round < 11; round++) {\n        if (energy >= 12) {\n            safe += 1;\n        }\n        energy -= 6;\n    }\n    printf(\"%d\\n\", safe);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int energy = 22;\n        int safe = 0;\n        for (int round = 0; round < 11; round++) {\n            if (energy >= 12) {\n                safe += 1;\n            }\n            energy -= 6;\n        }\n        System.out.println(safe);\n    }\n}"
 },
 "daily-283": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int level = 1; level < 8; level++) {\n        score += level * level;\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int level = 1; level < 8; level++) {\n            score += level * level;\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-284": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int energy = 60;\n    for (int round = 0; round < 6; round++) {\n        energy -= 8;\n    }\n    if (energy >= 20) {\n        puts(\"Safe\");\n    }\n    else {\n        puts(\"Recharge\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int energy = 60;\n        for (int round = 0; round < 6; round++) {\n            energy -= 8;\n        }\n        if (energy >= 20) {\n            System.out.println(\"Safe\");\n        }\n        else {\n            System.out.println(\"Recharge\");\n        }\n    }\n}"
 },
 "daily-285": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int mission = 1; mission < 29; mission++) {\n        if (mission % 9 == 0) {\n            score += mission;\n        }\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int mission = 1; mission < 29; mission++) {\n            if (mission % 9 == 0) {\n                score += mission;\n            }\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-286": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 6 * 16;\n    total += 5;\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 6 * 16;\n        total += 5;\n        System.out.println(total);\n    }\n}"
 },
 "daily-287": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    puts(\"Ready\");\n    puts(\"Power\");\n    puts(\"Go\");\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Ready\");\n        System.out.println(\"Power\");\n        System.out.println(\"Go\");\n    }\n}"
 },
 "daily-288": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int meter = 20;\n    meter += 7;\n    meter *= 2;\n    printf(\"%d\\n\", meter);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int meter = 20;\n        meter += 7;\n        meter *= 2;\n        System.out.println(meter);\n    }\n}"
 },
 "daily-289": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    puts(\"HERO READY\");\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"HERO READY\");\n    }\n}"
 },
 "daily-290": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d\\n\", 24 + 9);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(24 + 9);\n    }\n}"
 },
 "daily-291": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int round = 0; round < 8; round++) {\n        score += 26;\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int round = 0; round < 8; round++) {\n            score += 26;\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-292": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int badge = 12;\n    if (badge % 2 == 0) {\n        puts(\"Even\");\n    }\n    else {\n        puts(\"Odd\");\n    }\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int badge = 12;\n        if (badge % 2 == 0) {\n            System.out.println(\"Even\");\n        }\n        else {\n            System.out.println(\"Odd\");\n        }\n    }\n}"
 },
 "daily-293": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int energy = 11;\n    for (int i = 0; i < 5; i++) {\n        energy += 4;\n    }\n    printf(\"%d\\n\", energy);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int energy = 11;\n        for (int i = 0; i < 5; i++) {\n            energy += 4;\n        }\n        System.out.println(energy);\n    }\n}"
 },
 "daily-294": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int power = 13;\n    for (int i = 0; i < 3; i++) {\n        power *= 2;\n    }\n    printf(\"%d\\n\", power);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int power = 13;\n        for (int i = 0; i < 3; i++) {\n            power *= 2;\n        }\n        System.out.println(power);\n    }\n}"
 },
 "daily-295": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int score = 0;\n    for (int mission = 1; mission < 22; mission++) {\n        if (mission % 6 == 0) {\n            score += mission;\n        }\n    }\n    printf(\"%d\\n\", score);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int score = 0;\n        for (int mission = 1; mission < 22; mission++) {\n            if (mission % 6 == 0) {\n                score += mission;\n            }\n        }\n        System.out.println(score);\n    }\n}"
 },
 "daily-296": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int tokens = 0;\n    for (int i = 1; i < 11; i++) {\n        tokens += 17;\n        if (i % 2 == 0) {\n            tokens += 7;\n        }\n    }\n    printf(\"%d\\n\", tokens);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int tokens = 0;\n        for (int i = 1; i < 11; i++) {\n            tokens += 17;\n            if (i % 2 == 0) {\n                tokens += 7;\n            }\n        }\n        System.out.println(tokens);\n    }\n}"
 },
 "daily-297": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int total = 0;\n    for (int row = 1; row < 6; row++) {\n        for (int column = 0; column < 10; column++) {\n            if (row % 2 == 0) {\n                total += 2;\n            }\n            else {\n                total += 1;\n            }\n        }\n    }\n    printf(\"%d\\n\", total);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int row = 1; row < 6; row++) {\n            for (int column = 0; column < 10; column++) {\n                if (row % 2 == 0) {\n                    total += 2;\n                }\n                else {\n                    total += 1;\n                }\n            }\n        }\n        System.out.println(total);\n    }\n}"
 },
 "daily-298": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int power = 21;\n    for (int i = 0; i < 8; i++) {\n        power += 9;\n        if (power > 48) {\n            int power = 48;\n        }\n    }\n    printf(\"%d\\n\", power);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int power = 21;\n        for (int i = 0; i < 8; i++) {\n            power += 9;\n            if (power > 48) {\n                int power = 48;\n            }\n        }\n        System.out.println(power);\n    }\n}"
 },
 "daily-299": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int best = 23;\n    if (best < 19) {\n        int best = 19;\n    }\n    if (best < 16) {\n        int best = 16;\n    }\n    printf(\"%d\\n\", best);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int best = 23;\n        if (best < 19) {\n            int best = 19;\n        }\n        if (best < 16) {\n            int best = 16;\n        }\n        System.out.println(best);\n    }\n}"
 },
 "daily-300": {
  "c": "#include <stdio.h>\n\nint main(void) {\n    int shield = 25;\n    for (int i = 1; i < 10; i++) {\n        shield += 3;\n        if (i % 3 == 0) {\n            shield -= 2;\n        }\n    }\n    printf(\"%d\\n\", shield);\n    return 0;\n}",
  "java": "public class Main {\n    public static void main(String[] args) {\n        int shield = 25;\n        for (int i = 1; i < 10; i++) {\n            shield += 3;\n            if (i % 3 == 0) {\n                shield -= 2;\n            }\n        }\n        System.out.println(shield);\n    }\n}"
 }
};
