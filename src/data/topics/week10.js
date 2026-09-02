import { LC } from '../lc'

export const WEEK10_META = {
  id: 10,
  title: 'Object-Oriented Design & System Design Deep Dive',
  goal: 'Round out interview readiness beyond pure algorithms: object-oriented design exercises (Parking Lot, Elevator System) and full system design case studies (URL Shortener, Rate Limiter, News Feed) that apply week 7\'s fundamentals concretely.',
  dayIds: [
    'ood-fundamentals',
    'ood-parking-lot',
    'ood-elevator-system',
    'system-design-url-shortener',
    'system-design-rate-limiter',
    'system-design-news-feed',
    'week10-review-mock',
  ],
}

export const WEEK10_TOPICS = {
  'ood-fundamentals': {
    id: 'ood-fundamentals',
    title: 'Object-Oriented Design Fundamentals',
    week: 10,
    day: 64,
    category: 'Interview Readiness',
    summary:
      'A different skill from algorithmic coding: given an ambiguous real-world system, design the classes and relationships that model it cleanly and extensibly.',
    lesson: {
      intro:
        'Object-oriented design (OOD) interviews ask you to model a real-world system — a parking lot, an elevator, a deck of cards — as a set of classes, methods, and relationships. There\'s no single "correct" answer the way there is for a coding problem, but there are principles that reliably separate strong designs from weak ones, and a repeatable process for getting there under interview time pressure.',
      steps: [
        'Clarify requirements first, with the same discipline as system design (week 7): what must the system do, what\'s explicitly out of scope, who are the actors/use cases? Skipping this and diving straight into class names is the most common OOD mistake.',
        'A classic starting heuristic: nouns in the requirements become candidate classes, verbs become candidate methods. Don\'t follow this mechanically, but it\'s a reliable way to get unstuck.',
        'Encapsulation: hide a class\'s internal state behind methods, so other classes interact with *what* it does, not *how*. Abstraction: define behavior through an interface (in Python, an abstract base class) without dictating implementation, so multiple concrete classes can fulfill the same role.',
        'Inheritance ("is-a") vs. composition ("has-a"): inheritance shares behavior down a hierarchy (a Car IS-A Vehicle); composition builds a class out of others (a ParkingLot HAS Levels, a Level HAS Spots). When unsure, prefer composition — it\'s more flexible and avoids awkward hierarchies that don\'t hold up as requirements grow.',
        'Know SOLID at a conversational level: Single responsibility (a class should have one reason to change), Open/closed (open for extension, closed for modification), Liskov substitution (a subclass should be usable anywhere its base class is expected), Interface segregation (many small specific interfaces beat one large one), Dependency inversion (depend on abstractions, not concrete classes). You don\'t need to recite definitions — naming the principle you\'re applying, in passing, signals fluency.',
      ],
      example: {
        setup: 'Deciding class boundaries for a simple "deck of cards" system: a Card, a Deck, and a Player who holds cards.',
        walkthrough: [
          'Card is a small, mostly-data class: suit, rank, maybe a comparison method. It doesn\'t need to know about decks or players — keeping it simple is a Single Responsibility win.',
          'Deck HAS-A list of Cards (composition, not inheritance — a Deck is not a kind of Card). Its methods are behavior about the collection: shuffle(), deal(n), cards_remaining().',
          'Player HAS-A hand (a list of Cards) — again composition. A tempting-but-wrong alternative would be making Player inherit from Deck because "both hold cards" — that\'s an is-a mistake; a hand of cards and a deck of cards behave differently (you don\'t shuffle a hand), so sharing an inheritance hierarchy just to reuse a list would violate Liskov substitution the moment their behaviors diverge.',
          'This small exercise is the whole OOD process in miniature: identify nouns, decide is-a vs has-a deliberately, keep each class\'s responsibility narrow.',
        ],
      },
      code: `from abc import ABC, abstractmethod

# Abstraction: an interface via Python's ABC, implemented by concrete subclasses
class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount):
        ...

class CreditCard(PaymentMethod):
    def pay(self, amount):
        return f"Charged \${amount} to credit card"

class Cash(PaymentMethod):
    def pay(self, amount):
        return f"Accepted \${amount} cash"

# Composition: a class built from other classes, not inheriting from them
class Order:
    def __init__(self, payment_method: PaymentMethod):
        self.payment_method = payment_method  # depends on the abstraction, not a concrete class

    def checkout(self, amount):
        return self.payment_method.pay(amount)  # works with ANY PaymentMethod -- dependency inversion`,
      pitfalls: [
        'Diving into class names and methods before clarifying requirements — the "right" design depends heavily on scope the interviewer hasn\'t told you yet.',
        'Reaching for inheritance because two classes share a little behavior, when composition would be more flexible — a rule of thumb: if you\'re not confident every subclass could truly substitute for the base class everywhere (Liskov), prefer composition.',
        'Over-engineering with design patterns for a simple ask — introduce a pattern (Strategy, Observer, Factory) when the requirements actually motivate it, not to demonstrate you know the name.',
      ],
    },
    keyIdeas: [
      'Clarify requirements first — nouns become candidate classes, verbs become candidate methods, as a starting heuristic.',
      'Encapsulation hides internal state; abstraction (e.g., Python\'s ABC) defines behavior without dictating implementation.',
      'Prefer composition ("has-a") over inheritance ("is-a") when unsure — it\'s more flexible and avoids brittle hierarchies.',
      'SOLID principles, applied conversationally: single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.',
    ],
    problems: [],
  },

  'ood-parking-lot': {
    id: 'ood-parking-lot',
    title: 'OOD Practice: Design a Parking Lot',
    week: 10,
    day: 65,
    category: 'Interview Readiness',
    summary:
      'The classic OOD exercise, walked through end to end — a template for approaching any "design a system\'s classes" prompt.',
    lesson: {
      intro:
        'Parking Lot is the canonical OOD warm-up because it has natural composition (lot → levels → spots), a natural inheritance hierarchy (vehicle types), and enough real-world texture (different spot sizes, full-lot handling) to generate good follow-up discussion — exactly what makes it a durable interview staple.',
      steps: [
        'Clarify requirements: multiple levels, multiple spot sizes (motorcycle, compact, large), vehicles enter and get a ticket, vehicles exit and pay based on duration, the system tracks availability per level.',
        'Core classes: ParkingLot (composed of Levels), Level (composed of ParkingSpots), ParkingSpot (has a size, and either holds a Vehicle or is empty), a Vehicle hierarchy (Motorcycle, Car, Bus — inheritance fits here since they share "is-a Vehicle" behavior like a size requirement), and Ticket (links a Vehicle to a Spot and an entry time).',
        'Key methods: ParkingLot.park_vehicle(vehicle) finds an available appropriately-sized spot and returns a Ticket; ParkingLot.unpark_vehicle(ticket) frees the spot and computes a fee from elapsed time.',
        'Discuss extensibility explicitly: adding a new vehicle type or spot size shouldn\'t require rewriting the core parking logic — this is the Open/Closed principle from yesterday made concrete, and interviewers often probe exactly this ("what if we add electric vehicle charging spots?").',
        'Discuss edge cases interviewers commonly probe: the lot is full (park_vehicle should fail gracefully, not crash), a bus needing multiple consecutive large spots, multiple entrances needing a consistent view of availability (briefly mention this is a concurrency concern in a real system, without needing to solve it fully).',
      ],
      example: {
        setup: 'Parking a Car when Level 1 has one open compact spot.',
        walkthrough: [
          'ParkingLot.park_vehicle(car) is called. It asks each Level, in order, "do you have a spot that fits this vehicle?"',
          'Level 1\'s find_available_spot(CAR) scans its spots for one sized COMPACT or larger that\'s currently empty — finds the one open compact spot.',
          'The spot is marked occupied with a reference to the car; a Ticket is created recording the vehicle, the spot, and the entry timestamp; the ticket is returned to the caller.',
          'Later, unpark_vehicle(ticket) looks up the spot from the ticket, computes elapsed time, marks the spot empty again, and returns the fee.',
        ],
      },
      code: `from abc import ABC
from enum import Enum
from datetime import datetime

class SpotSize(Enum):
    MOTORCYCLE = 1
    COMPACT = 2
    LARGE = 3

class Vehicle(ABC):
    def __init__(self, license_plate, size_needed: SpotSize):
        self.license_plate = license_plate
        self.size_needed = size_needed

class Motorcycle(Vehicle):
    def __init__(self, license_plate):
        super().__init__(license_plate, SpotSize.MOTORCYCLE)

class Car(Vehicle):
    def __init__(self, license_plate):
        super().__init__(license_plate, SpotSize.COMPACT)

class ParkingSpot:
    def __init__(self, size: SpotSize):
        self.size = size
        self.vehicle = None

    def is_available(self):
        return self.vehicle is None

    def fits(self, vehicle: Vehicle):
        return self.is_available() and self.size.value >= vehicle.size_needed.value

class Level:
    def __init__(self, spots):
        self.spots = spots

    def find_available_spot(self, vehicle):
        for spot in self.spots:
            if spot.fits(vehicle):
                return spot
        return None

class Ticket:
    def __init__(self, vehicle, spot):
        self.vehicle = vehicle
        self.spot = spot
        self.entry_time = datetime.now()

class ParkingLot:
    def __init__(self, levels):
        self.levels = levels

    def park_vehicle(self, vehicle):
        for level in self.levels:
            spot = level.find_available_spot(vehicle)
            if spot:
                spot.vehicle = vehicle
                return Ticket(vehicle, spot)
        return None  # lot full`,
      pitfalls: [
        'Modeling every real-world detail (payment gateways, security cameras, license plate cameras) instead of focusing on the core object model the interviewer actually cares about — scope tightly to what was asked.',
        'Not discussing how the spot-assignment strategy could change — "what if we want to prefer spots closer to the entrance?" is a common follow-up, and naming this as a Strategy-pattern opportunity (a pluggable assignment policy) is a strong answer.',
        'Ignoring the full-lot edge case until the interviewer points it out — mention it proactively, it\'s an easy signal of thoroughness.',
      ],
    },
    keyIdeas: [
      'Composition for structure (lot has levels has spots); inheritance for the vehicle type hierarchy.',
      'Core methods: park_vehicle finds a fitting spot and issues a Ticket; unpark_vehicle frees it and computes a fee.',
      'Discuss extensibility (new vehicle/spot types) and edge cases (full lot, multi-spot vehicles) proactively.',
      'The value is in the process — clarify, identify classes, define methods, discuss trade-offs — not in memorizing one "correct" class diagram.',
    ],
    problems: [],
  },

  'ood-elevator-system': {
    id: 'ood-elevator-system',
    title: 'OOD Practice: Design an Elevator System',
    week: 10,
    day: 66,
    category: 'Interview Readiness',
    summary:
      'A more dynamic OOD exercise than Parking Lot — tests modeling state machines and request-scheduling logic, with genuine algorithmic trade-offs to discuss.',
    lesson: {
      intro:
        'Elevator System is a step up from Parking Lot: instead of a mostly-static object structure, you\'re modeling *behavior over time* — an elevator\'s state changes as it responds to requests, and deciding which elevator should answer a new request is a real scheduling problem with genuine trade-offs to discuss.',
      steps: [
        'Clarify requirements: how many elevators, how many floors, external requests (a floor\'s up/down call button) vs. internal requests (a floor button pressed inside a specific elevator), and what scheduling behavior is expected.',
        'Core classes: Elevator (state: current floor, direction, a queue of target floors), ElevatorSystem/Controller (owns multiple Elevators, decides which one answers a new external request), and Request (a floor plus a direction, or just a target floor for internal requests).',
        'Model an elevator\'s state as a simple state machine: IDLE, MOVING_UP, MOVING_DOWN, DOORS_OPEN — new requests and completed movements trigger transitions between these states. Sketching this as an explicit small diagram (states + transitions) is exactly the kind of structure interviewers want to see before code.',
        'Scheduling algorithm: start with the simplest reasonable policy — assign the nearest elevator (by distance) that\'s idle or already moving toward the request in the same direction. This is a genuine approximation of how real elevator systems work, and starting simple, then discussing refinements, is stronger than jumping to a complex "optimal" assignment algorithm immediately.',
        'Discuss edge cases and refinements interviewers probe: what happens when all elevators are busy (queue the request); should a full elevator (weight sensor) skip further pickups; should a moving elevator refuse a request it would have to reverse direction for, deferring it instead — naming these as deliberate refinements, rather than solving all of them immediately, is the right pace for the conversation.',
      ],
      example: {
        setup: 'Three elevators at floors 2, 5, and 9. A new external request arrives: floor 6, wanting to go up.',
        walkthrough: [
          'Elevator at floor 2: distance 4, and even if idle, it\'s farther away — lower priority.',
          'Elevator at floor 5: distance 1. If it\'s idle, or already moving up (and hasn\'t passed floor 6 yet), it\'s a strong candidate.',
          'Elevator at floor 9: distance 3, and if it\'s moving up, it\'s already moving *away* from floor 6 — a poor candidate even though it might numerically look plausible.',
          'The nearest-elevator-moving-in-a-compatible-direction policy picks the elevator at floor 5 — this is the simple policy from step 4, applied concretely.',
        ],
      },
      code: `from enum import Enum

class Direction(Enum):
    UP = 1
    DOWN = -1
    IDLE = 0

class Elevator:
    def __init__(self, elevator_id, current_floor=0):
        self.id = elevator_id
        self.current_floor = current_floor
        self.direction = Direction.IDLE
        self.target_floors = []  # sorted queue of stops

    def add_request(self, floor):
        if floor not in self.target_floors:
            self.target_floors.append(floor)
            self.target_floors.sort(
                key=lambda f: abs(f - self.current_floor)
            )

class ElevatorSystem:
    def __init__(self, num_elevators):
        self.elevators = [Elevator(i) for i in range(num_elevators)]

    def request_elevator(self, floor, direction: Direction):
        best = None
        best_distance = float('inf')
        for elevator in self.elevators:
            compatible = (
                elevator.direction == Direction.IDLE or
                elevator.direction == direction
            )
            distance = abs(elevator.current_floor - floor)
            if compatible and distance < best_distance:
                best, best_distance = elevator, distance

        if best is None:  # all elevators busy in the wrong direction -- fall back to nearest
            best = min(self.elevators, key=lambda e: abs(e.current_floor - floor))
        best.add_request(floor)
        return best`,
      pitfalls: [
        'Jumping straight to an "optimal" assignment algorithm (e.g., minimizing total wait time across all pending requests) before establishing a working simple policy — start simple, then discuss what a more sophisticated version would optimize for.',
        'Forgetting to model direction compatibility — assigning an elevator that would have to pass by and reverse direction to reach a request is a realistic bug to name and address.',
        'Treating this as a pure coding problem and writing code silently — the trade-off discussion (why nearest-elevator, what breaks at scale, what a real system additionally handles) is most of the signal in an OOD round.',
      ],
    },
    keyIdeas: [
      'Model elevator state explicitly as a small state machine (IDLE, MOVING_UP, MOVING_DOWN, DOORS_OPEN).',
      'Start with a simple scheduling policy (nearest compatible elevator), then discuss refinements out loud.',
      'Distinguish external requests (floor + direction) from internal requests (just a target floor).',
      'Name edge cases proactively: all elevators busy, weight limits, direction-reversal avoidance.',
    ],
    problems: [],
  },

  'system-design-url-shortener': {
    id: 'system-design-url-shortener',
    title: 'System Design Case Study: URL Shortener',
    week: 10,
    day: 67,
    category: 'Interview Readiness',
    summary:
      'Apply week 7\'s system design fundamentals to a full, concrete design end to end — the template for how an actual system design round flows.',
    lesson: {
      intro:
        'A URL shortener is one of the most commonly asked system design questions precisely because it\'s small enough to fully design in 45 minutes, yet touches API design, data modeling, an encoding scheme, and — most importantly — the caching and scaling concepts from week 7, applied to a system that\'s genuinely, overwhelmingly read-heavy.',
      steps: [
        'Clarify requirements and scope: shorten a long URL into a short one; redirect short → long on access; explicitly state what\'s out of scope unless asked (custom aliases, expiration, click analytics) — scoping out loud is itself a signal of experience.',
        'Estimate scale before designing: e.g., "let\'s say 100 million new URLs per day, and a 100:1 read-to-write ratio typical of this kind of system" — this back-of-envelope habit is what should drive your storage and caching decisions, and naming it explicitly is a strong signal to interviewers.',
        'API design: POST /shorten {long_url} → {short_url}; GET /{short_code} → HTTP 302 redirect to the original long_url.',
        'Encoding scheme — the core technical decision: hash the long URL (simple, but collisions are possible and need handling), or maintain a counter and encode it in base62 (the 62 characters a-z, A-Z, 0-9) — a counter is collision-free by construction and a 7-character base62 code covers 62⁷ ≈ 3.5 trillion unique values, comfortably enough. Discussing this trade-off explicitly (collision-free counter vs. simpler-feeling hash) is more valuable than picking either silently.',
        'Data model and scaling: a key-value store (short_code → long_url) fits this access pattern well. Given the extreme read skew, caching hot redirects (week 7\'s caching lesson, applied concretely) is the single highest-leverage optimization here — most requests should never even reach the database.',
      ],
      example: {
        setup: 'Generating a short code for the 1,000,000th URL using the counter + base62 approach.',
        walkthrough: [
          'A global (or sharded) counter is incremented for each new URL; this URL gets counter value 1,000,000.',
          'Convert 1,000,000 to base62 using the 62-character alphabet: repeatedly divide by 62, collecting remainders as digits, then reverse.',
          '1,000,000 in base62 comes out to a short handful of characters (around 4) — dramatically shorter than the original long URL, and guaranteed unique since it came from a strictly increasing counter.',
          'The short code is stored as the key, the original long URL as the value, in a key-value store — later, GET /{short_code} is a single fast lookup.',
        ],
      },
      code: `ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
BASE = len(ALPHABET)  # 62

def encode(counter_value):
    if counter_value == 0:
        return ALPHABET[0]
    digits = []
    while counter_value > 0:
        counter_value, remainder = divmod(counter_value, BASE)
        digits.append(ALPHABET[remainder])
    return "".join(reversed(digits))

def decode(short_code):
    value = 0
    for ch in short_code:
        value = value * BASE + ALPHABET.index(ch)
    return value`,
      pitfalls: [
        'Skipping capacity estimation and jumping straight to architecture diagrams — interviewers explicitly watch for whether you ground decisions in scale.',
        'Choosing hash-based short codes without discussing collision handling (checking for existing keys, retry-with-salt) — a hash approach isn\'t wrong, but presenting it without addressing collisions is incomplete.',
        'Forgetting to discuss caching even though this system is enormously read-heavy — that omission is the most common way to leave value on the table in this specific question.',
      ],
    },
    keyIdeas: [
      'Scope requirements explicitly, then estimate scale before proposing architecture — both are signals of experience.',
      'Counter + base62 encoding is collision-free and simple; hash-based encoding needs explicit collision handling.',
      'A key-value store fits the access pattern; caching hot redirects is the highest-leverage optimization given the read-heavy skew.',
      'This case study is a template — the same clarify → estimate → API → data model → scale flow applies to most system design questions.',
    ],
    problems: [
      { title: 'Encode and Decode TinyURL', difficulty: 'Medium', url: LC('encode-and-decode-tinyurl'), note: 'a small codeable slice of this exact system' },
    ],
    resources: [{ label: 'system-design-primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer' }],
  },

  'system-design-rate-limiter': {
    id: 'system-design-rate-limiter',
    title: 'System Design Case Study: Rate Limiter',
    week: 10,
    day: 68,
    category: 'Interview Readiness',
    summary:
      'A "design a component" question — restrict how many requests a client can make in a time window — that tests fluency with a few classic algorithms and their genuine trade-offs.',
    lesson: {
      intro:
        'A rate limiter caps how many requests a client (per user, per IP, per API key) can make in a given time period. Unlike URL Shortener, the interesting content here is mostly algorithmic: several well-known approaches exist, each with a specific, nameable weakness, and picking (or progressing through) them thoughtfully is the core of the discussion.',
      steps: [
        'Clarify requirements: what\'s being limited (per-user, per-IP, per-API-key), what happens on violation (reject with HTTP 429, queue, throttle), and whether the system is single-server or distributed across many servers.',
        'Fixed window counter: count requests in fixed-size time buckets (e.g., per calendar minute). Simple to implement, but bursty at window boundaries — a client could send the full limit right before a window ends and again right after, achieving up to 2x the intended rate in a short span.',
        'Sliding window log: store a timestamp for every request; on each check, count how many timestamps fall within the last N seconds. Accurate — no boundary issue — but memory-heavy, since it stores every individual request timestamp.',
        'Sliding window counter: a practical compromise. Keep counts per fixed window (like the fixed-window approach), but weight the previous window\'s count proportionally by how far into the current window you are. This approximates the sliding log\'s accuracy with the fixed window\'s low memory footprint — the default choice in most real systems.',
        'Token bucket: a bucket holds up to capacity tokens and refills at a fixed rate; each request consumes one token and is rejected if the bucket is empty. This naturally allows short bursts (up to the bucket\'s capacity) while still enforcing a long-term average rate — popular because it\'s simple to reason about and burst-tolerant by design.',
        'Distributed rate limiting: with multiple servers, counter/bucket state must live somewhere shared (e.g., Redis) rather than in each server\'s local memory — otherwise a client could exceed the intended limit simply by being routed to different servers. This connects directly back to week 7\'s caching/shared-state lesson.',
      ],
      example: {
        setup: 'Token bucket with capacity 5, refill rate 1 token/second. A burst of 5 requests arrives instantly, then a 6th arrives 0.5 seconds later.',
        walkthrough: [
          'Bucket starts full: 5 tokens. Each of the first 5 requests consumes 1 token; all 5 succeed, bucket now at 0 tokens.',
          '0.5 seconds pass. At a refill rate of 1/second, the bucket has regained 0.5 tokens — not yet a full token.',
          'The 6th request needs 1 full token but only 0.5 is available — rejected.',
          'If instead the 6th request had arrived 1.2 seconds after the burst, the bucket would have refilled to min(capacity, 1.2) = 1.2 tokens, enough for the request to succeed, consuming down to 0.2 remaining.',
        ],
      },
      code: `import time

class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.refill_rate = refill_rate  # tokens per second
        self.tokens = capacity
        self.last_refill = time.monotonic()

    def _refill(self):
        now = time.monotonic()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

    def allow_request(self):
        self._refill()
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False`,
      pitfalls: [
        'Presenting fixed window as the final answer without naming its boundary-burst weakness — interviewers often ask "what breaks here?" specifically to see if you\'ll surface it yourself.',
        'Designing a single-server solution and forgetting to address distributed state when multiple servers are explicitly in scope — this is one of the most common system design follow-ups.',
        'Jumping straight to token bucket without walking through the simpler alternatives first — showing the progression (fixed window → its weakness → sliding window / token bucket as a response) demonstrates real understanding, not memorized vocabulary.',
      ],
    },
    keyIdeas: [
      'Fixed window: simple, but bursty at window boundaries.',
      'Sliding window log: accurate, but memory-heavy (stores every timestamp).',
      'Sliding window counter: the practical compromise most real systems use.',
      'Token bucket: naturally burst-tolerant while enforcing a long-term rate; distributed limiting needs shared state (e.g., Redis).',
    ],
    problems: [],
    resources: [{ label: 'system-design-primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer' }],
  },

  'system-design-news-feed': {
    id: 'system-design-news-feed',
    title: 'System Design Case Study: News Feed',
    week: 10,
    day: 69,
    category: 'Interview Readiness',
    summary:
      'A larger system design question that pulls together data modeling, fan-out strategy, and caching — a capstone that combines nearly everything from week 7 and this week.',
    lesson: {
      intro:
        'A news feed shows each user a roughly chronological stream of posts from people they follow. It\'s a favorite system design question because the "obvious" first design has a specific, famous failure mode (the celebrity problem) that a good candidate discovers and addresses during the conversation — which is exactly what makes it a strong signal for interviewers.',
      steps: [
        'Clarify requirements: users follow other users; each user sees a feed of recent posts from people they follow, roughly chronological — explicitly scope out any ranking/ML-based ordering unless the interviewer asks for it.',
        'Data model: Post (id, author, content, timestamp) and Follow (follower_id, followee_id) — a graph-like relationship between users.',
        'Approach 1 — fan-out on read: when a user opens their feed, query posts from everyone they follow, merge, and sort by time. Simple and always fresh, but slow for users who follow many people, since it\'s a relatively expensive query done at *every* read.',
        'Approach 2 — fan-out on write: when a user posts, immediately push that post into a precomputed feed (cache) for every one of their followers. Reads become very fast (just read the precomputed list) — but this creates the "celebrity problem": a single post from an account with millions of followers triggers millions of writes for that one post.',
        'The hybrid approach real systems use: fan-out on write for most users (whose follower counts are small enough that the write burst is manageable); for accounts with very large follower counts, fall back to fan-out on read for their posts specifically — merging them into a follower\'s feed at read time instead of pushing to millions of caches. Explaining *why* each half of the hybrid exists is what separates a strong answer from a memorized one.',
      ],
      example: {
        setup: 'Quantifying the celebrity problem: an account with 50 million followers posts once.',
        walkthrough: [
          'Under pure fan-out on write, that single post triggers 50 million individual feed-cache writes — one per follower — for one post.',
          'If that account posts often, the write load from this one account alone could dwarf the write load from millions of ordinary users combined.',
          'Under the hybrid approach, this account\'s posts are excluded from the eager fan-out; instead, followers merge in this account\'s recent posts at read time (fan-out on read, just for this small set of huge accounts) — bounding the worst-case write burst regardless of how large a single account\'s follower count grows.',
        ],
      },
      code: `import heapq

# Fan-out on read: merge each followed user's already-sorted recent posts into one feed
# (this is literally the Merge k Sorted Lists pattern from week 2, applied to a feed)
def generate_feed(followed_users_posts, limit=20):
    # followed_users_posts: list of lists, each already sorted newest-first by timestamp
    heap = []
    for i, posts in enumerate(followed_users_posts):
        if posts:
            # store (-timestamp, list_index, post_index) -- max-heap behavior via negation
            heapq.heappush(heap, (-posts[0].timestamp, i, 0))

    feed = []
    while heap and len(feed) < limit:
        neg_ts, list_idx, post_idx = heapq.heappop(heap)
        feed.append(followed_users_posts[list_idx][post_idx])
        next_idx = post_idx + 1
        if next_idx < len(followed_users_posts[list_idx]):
            next_post = followed_users_posts[list_idx][next_idx]
            heapq.heappush(heap, (-next_post.timestamp, list_idx, next_idx))
    return feed`,
      pitfalls: [
        'Designing only fan-out on write without naming the celebrity problem — this is close to the single most common specific follow-up interviewers ask on this question.',
        'Forgetting to mention caching for the precomputed feeds themselves, on top of the fan-out strategy — the two are complementary, not the same thing.',
        'Over-engineering with a full ranking/ML system when the requirements explicitly asked for a chronological feed — solve the scoped problem well before speculating about unscoped extensions.',
      ],
    },
    keyIdeas: [
      'Fan-out on read: simple, always fresh, slow for users following many people.',
      'Fan-out on write: fast reads, but creates the celebrity problem for high-follower accounts.',
      'Real systems hybridize: fan-out on write generally, fan-out on read specifically for huge accounts.',
      'This question is a capstone — it combines data modeling, the caching lesson from week 7, and (via feed-merging) the Merge k Sorted Lists pattern from week 2.',
    ],
    problems: [
      { title: 'Merge k Sorted Lists', difficulty: 'Hard', url: LC('merge-k-sorted-lists'), note: 'revisit — this is the fan-out-on-read merge step' },
      { title: 'Design Twitter', difficulty: 'Medium', url: LC('design-twitter'), note: 'revisit — a small codeable slice of this exact system' },
    ],
    resources: [{ label: 'system-design-primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer' }],
  },

  'week10-review-mock': {
    id: 'week10-review-mock',
    title: 'Review & System Design Mock Interview',
    week: 10,
    day: 70,
    category: 'Review',
    isReview: true,
    summary:
      'Consolidate OOD and system design, then run a dedicated system design mock interview — a different rhythm from a coding mock, worth practicing separately.',
    keyIdeas: [
      'Re-walk the Parking Lot or Elevator class design from a blank page, narrating requirements → classes → methods → edge cases out loud.',
      'Re-walk one system design case study (URL Shortener is the fastest full run-through) end to end: requirements → scale estimate → API → data model → scaling.',
      'Run a system design mock interview if possible (Pramp and interviewing.io both support this format, not just coding) — the pacing and open-endedness are genuinely different skills from a coding round.',
      'Spaced repetition: re-solve one DP problem from week 9 and one graph problem from week 5.',
    ],
    problems: [],
  },
}
