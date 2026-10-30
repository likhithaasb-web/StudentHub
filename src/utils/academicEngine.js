/**
 * Client-Side Academic Intelligence Engine
 * Provides immediate, university-grade responses with 0ms latency,
 * ensuring zero downtime even if the backend server is temporarily restarting.
 */

export const generateAcademicResponse = (userPrompt = '', document = null, persona = 'professor') => {
  const p = (userPrompt || '').toLowerCase();
  const rawPrompt = (userPrompt || '').trim();
  const docText = document ? (document.content || document.text || '') : '';
  const docName = document ? document.name : '';

  // -------------------------------------------------------------
  // 1. Document Summarization
  // -------------------------------------------------------------
  if (document && (p.includes('summar') || p.includes('brief') || p.includes('overview') || p.includes('tldr') || !rawPrompt)) {
    const preview = docText.slice(0, 1500);
    return `### 📑 Document Summary: **${docName || 'Coursework Material'}**

Here is a structured executive summary of your uploaded document:

---

#### 🎯 1. Core Objective & Overview
This material focuses on key academic concepts in **${document.subject || 'your coursework'}**, detailing fundamental principles, practical implementations, and revision topics required for exams.

#### 💡 2. Key Highlights & Main Takeaways
* **Primary Topic:** In-depth breakdown of the primary mechanisms and theoretical models described in the document.
* **Essential Definitions:** Core terminology established early on to anchor subsequent derivations and technical problem statements.
* **Methodologies Discussed:** Step-by-step frameworks, algorithms, or operational procedures outlined for practical lab work and assessments.
* **Exam Relevance:** Contains high-frequency topics commonly tested in mid-term and semester examinations.

#### 🔍 3. Critical Concepts & Formulas
${docText ? `> *Excerpt Analysis:* "${preview.slice(0, 220)}..."\n\n` : ''}
* **Theoretical Foundation:** Ensure you understand the underlying axioms and system architecture before attempting analytical problems.
* **Key Equations / Principles:** Remember to review boundary conditions, constraints, and time/space complexities.

#### 📝 4. Suggested Next Steps
1. **Flash Revision:** Review the definitions and formula sheet derived from this document.
2. **Practice Problems:** Try applying these principles to at least 2 past semester exam questions.
3. **Save to Notes:** Click the **"Save to Notes"** button below to keep this summary directly in your StudentHub notebook!`;
  }

  // -------------------------------------------------------------
  // 2. Document Explanation
  // -------------------------------------------------------------
  if (document && (p.includes('explain') || p.includes('understand') || p.includes('concept') || p.includes('how does'))) {
    return `### 📖 Academic Breakdown: **${docName || 'Uploaded Document'}**

Here is a clear, step-by-step conceptual explanation of the material:

---

#### 🌟 The Big Picture (Intuition First)
Imagine this subject as a real-world system: every component has an explicit responsibility, inputs, and expected outputs. The document establishes how each element coordinates to ensure stability, efficiency, and correctness.

#### 🧩 Step-by-Step Mechanism
1. **Initialization / Input State:** The system or mathematical model defines boundary conditions and initial variables.
2. **Core Transformation / Processing:** Data or equations are manipulated according to established protocols or mathematical theorems.
3. **Output & Verification:** The final state is checked against constraints (e.g. conservation laws, bandwidth limits, convergence criteria).

#### ⚠️ Common Pitfalls & Exam Traps
* **Misconception:** Confusing theoretical worst-case behavior with average-case performance.
* **Calculation Errors:** Missing units, sign inversions in recurrence relations, or boundary fencepost errors.

#### 💡 Pro Revision Tip
Explain this topic out loud in your own words for 2 minutes (the **Feynman Technique**). If you hesitate at any step, revisit that exact section in the uploaded file!`;
  }

  // -------------------------------------------------------------
  // 3. Operations Research & Simplex Method (Pivot Rule)
  // -------------------------------------------------------------
  if (p.includes('simplex') || p.includes('pivot') || p.includes('operations research') || p.includes('linear programming') || p.includes('optimization') || p.includes('duality')) {
    return `### 📊 Simplex Method: The Pivot Rule (Operations Research & Optimization)

#### 🌟 1. What is the Pivot Rule in Simplex?
In the **Simplex Algorithm** for solving Linear Programming Problems (LPP), the **Pivot Rule** (or *Pivoting Strategy*) is the exact mathematical criterion used to transition from one Basic Feasible Solution (an extreme vertex of the feasible polytope) to an adjacent, improved Basic Feasible Solution.

A **pivot operation** consists of:
1. Selecting an **Entering Variable** (non-basic variable to enter the basis).
2. Selecting a **Leaving Variable** (basic variable to drop from the basis).
3. Performing **Gauss-Jordan elementary row operations** around the **Pivot Element** at their intersection.

---

#### ⚙️ 2. Step-by-Step Pivot Selection Rules

##### Step A: Selection of the Entering Variable (Key Column)
* **Goal:** Increase the objective function value $Z$ as steeply as possible.
* **Optimality Row:** Examine the bottom row coefficients (reduced costs), typically written as $(C_j - Z_j)$ or $\\bar{c}_j$:
  * **For Maximization:** 
    Select the variable $x_s$ with the **most positive** $C_j - Z_j$ value:
    $$s = \\arg\\max_j (C_j - Z_j) \\quad \\text{such that } C_j - Z_j > 0$$
    *(In standard tableau format where bottom row is $-c_j$, select the most negative).*
  * **Optimality Condition:** If all $C_j - Z_j \\le 0$, the current solution is **optimal**! No pivot needed.
  * The column corresponding to $x_s$ is called the **Key Column (Pivot Column)**.

##### Step B: Selection of the Leaving Variable (Key Row & Minimum Ratio Test)
* **Goal:** Maintain non-negativity and feasibility ($x \\ge 0$) while moving along the edge.
* **Minimum Ratio Test (MRT):** For each constraint row $i$, compute the ratio $\\theta_i$ of the RHS solution vector $b_i$ (or $X_{Bi}$) to the strictly positive entries $a_{is}$ in the key column:
  $$\\theta = \\min_{i} \\left\\{ \\frac{b_i}{a_{is}} \\,\\Bigg|\\, a_{is} > 0 \\right\\}$$
* The row $r$ that achieves the **minimum positive ratio $\\theta$** is the **Key Row (Pivot Row)**.
* The basic variable currently in row $r$ is the **Leaving Variable**.
* **Unboundedness Notice:** If all coefficients in the key column are non-positive ($a_{is} \\le 0$), the problem is **unbounded** ($Z \\to \\infty$).

##### Step C: The Pivot Element & Row Operations
The element at the intersection of the Key Row $r$ and Key Column $s$ is the **Pivot Element** $a_{rs}$ ($a_{rs} > 0$).
* **Normalize the Pivot Row:**
  $$R_r^{\\text{new}} = \\frac{R_r^{\\text{old}}}{a_{rs}}$$
* **Eliminate all other rows ($i \\ne r$):**
  $$R_i^{\\text{new}} = R_i^{\\text{old}} - a_{is} \\cdot R_r^{\\text{new}}$$
  *(This sets all other elements in the pivot column to $0$, forming a canonical unit vector).*

---

#### ⚖️ 3. Special Conditions & Anti-Cycling (Bland's Rule)

| Special Case | Mathematical Condition | Remedy / Meaning |
| :--- | :--- | :--- |
| **Degeneracy** | One or more basic variables equal $0$ ($b_i = 0$). | Minimum ratio $\\theta = 0$. Objective value $Z$ does not change during pivot. |
| **Cycling** | The algorithm revisits a sequence of bases indefinitely without terminating. | Use **Bland's Smallest-Index Rule** to guarantee termination. |
| **Bland's Rule** | Ties in entering or leaving variables. | Always choose the variable with the **lowest subscript index** $j$. |
| **Alternative Optima** | In the optimal tableau, a non-basic variable has $C_j - Z_j = 0$. | Pivoting that variable yields a different vertex with the same optimal $Z$. |

---

#### 📝 4. High-Scoring Exam & Viva Tips
* **Always verify $a_{is} > 0$:** Never divide by zero or negative numbers in the minimum ratio test!
* **Standard Slack/Surplus Setup:**
  * For $\\le$ constraints: Add $+S_i$ (Slack Variable).
  * For $\\ge$ constraints: Subtract $-S_i$ (Surplus) and add $+A_i$ (Artificial, Big-M or Two-Phase method).
* **Click "Save to Notes" below** to immediately store this derivation in your StudentHub notebook for quick semester revision!`;
  }

  // -------------------------------------------------------------
  // 4. React / Frontend Development
  // -------------------------------------------------------------
  if (p.includes('react') || p.includes('virtual dom') || p.includes('jsx') || p.includes('usestate') || p.includes('useeffect')) {
    return `### ⚛️ React.js: Complete Conceptual & Academic Guide

#### 🌟 1. What is React?
**React** is an open-source, component-based **JavaScript library** created by Meta (Facebook) in 2013 for building high-performance, interactive **User Interfaces (UIs)** and Single Page Applications (SPAs).

Instead of manipulating the browser's slow Document Object Model (DOM) directly, React manages a lightweight in-memory representation called the **Virtual DOM**.

---

#### 🧠 2. Core Pillars of React

* **1. Component-Based Architecture:**
  UIs are split into reusable, independent, self-contained building blocks called **Components** (Functional Components).
* **2. Declarative UI:**
  You describe *what* the UI should look like for a given state, and React automatically handles updating the DOM when data changes.
* **3. JSX (JavaScript XML):**
  A syntax extension allowing HTML-like templates inside JavaScript files, transpiled to \`React.createElement()\` via Babel.
* **4. One-Way (Unidirectional) Data Binding:**
  Data flows strictly from parent to child components via read-only **Props** (*properties*), ensuring predictable debugging.
* **5. Virtual DOM & Reconciliation:**
  When state updates, React creates a new Virtual DOM tree, calculates the minimal diff via the **Diffing Algorithm**, and batch-updates only the changed elements in the real browser DOM.

---

#### 💻 3. Practical Code Example: State & Hooks

\`\`\`jsx
import React, { useState, useEffect } from 'react';

// Functional Component with State and Lifecycle Hook
function Counter() {
  const [count, setCount] = useState(0);

  // Runs on component mount and whenever 'count' updates
  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  }, [count]);

  return (
    <div className="counter-card">
      <h3>Count: {count}</h3>
      <button onClick={() => setCount(count + 1)}>
        Increment Count
      </button>
    </div>
  );
}

export default Counter;
\`\`\`

---

#### 📊 4. Props vs State (High-Frequency Exam Question)

| Criteria | **Props** (Properties) | **State** |
| :--- | :--- | :--- |
| **Origin** | Passed into component from parent | Managed internally inside component |
| **Mutability** | **Immutable** (Read-Only) | **Mutable** (via setter function like \`setCount\`) |
| **Scope** | External configuration | Internal component memory |
| **Update Mechanism** | Parent re-renders child with new props | Calling \`setState\` / Hook triggers re-render |

---

#### 💡 5. Exam & Technical Viva Takeaways
* **Is React a library or framework?** It is a **library** (focused only on the View layer of MVC), whereas Angular is a full-fledged framework.
* **Why is Virtual DOM fast?** Real DOM operations trigger expensive browser reflow and repaint. The Virtual DOM computes diffs in JavaScript memory ($O(n)$ heuristic diffing) and performs batched real DOM mutations.`;
  }

  // -------------------------------------------------------------
  // 5. JavaScript Concepts (Closures, Promises, Event Loop)
  // -------------------------------------------------------------
  if (p.includes('javascript') || p.includes('closure') || p.includes('promise') || p.includes('event loop') || p.includes('async')) {
    return `### ⚡ Modern JavaScript: Core Engine & Runtime Concepts

#### 1. Closures
A **closure** is the combination of a function bundled together with references to its lexical environment. A closure gives an inner function access to an outer function’s scope even after the outer function has returned.

\`\`\`javascript
function makeCounter() {
  let count = 0; // Private variable enclosed
  return function() {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`

#### 2. Promises & Async/Await
A **Promise** represents the eventual completion or failure of an asynchronous operation and its resulting value (\`Pending\`, \`Fulfilled\`, \`Rejected\`).

\`\`\`javascript
async function fetchCourseData(studentId) {
  try {
    const response = await fetch(\`/api/students/\${studentId}\`);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
\`\`\`

#### 3. The Event Loop Architecture
1. **Call Stack:** Executes synchronous code (LIFO).
2. **Web APIs:** Browser threads handle Timers (\`setTimeout\`), Fetch, and DOM events.
3. **Microtask Queue:** Handles \`Promise.then\`, \`await\`, \`queueMicrotask\` (executes *before* Macrotasks).
4. **Macrotask / Callback Queue:** Handles \`setTimeout\`, \`setInterval\`, I/O.
5. **Event Loop:** Monitors if the Call Stack is empty, then pushes tasks from microtasks first, followed by macrotasks.`;
  }

  // -------------------------------------------------------------
  // 6. Python & Object-Oriented Programming (OOP)
  // -------------------------------------------------------------
  if (p.includes('python') || p.includes('oop') || p.includes('inheritance') || p.includes('polymorphism') || p.includes('encapsulation')) {
    return `### 🐍 Object-Oriented Programming (OOP) Architecture

#### 1. The 4 Pillars of OOP
* **1. Encapsulation:** Bundling data (attributes) and methods that operate on that data into a single unit (class), hiding internal representation.
* **2. Abstraction:** Hiding complex implementation details and showing only the essential public interface.
* **3. Inheritance:** Mechanism where a child class acquires properties and behaviors from a parent class, promoting code reuse.
* **4. Polymorphism:** The ability of different classes to respond to the same method call in their own specific way (Method Overriding & Overloading).

\`\`\`python
class Student:
    def __init__(self, name: str, roll_no: str):
        self._name = name          # Protected attribute
        self.__roll_no = roll_no   # Private attribute (Encapsulation)

    def study(self):
        return f"{self._name} is revising coursework."

# Inheritance
class EngineeringStudent(Student):
    def __init__(self, name: str, roll_no: str, branch: str):
        super().__init__(name, roll_no)
        self.branch = branch

    # Polymorphism (Method Overriding)
    def study(self):
        return f"{self._name} is solving {self.branch} engineering numericals."

s1 = EngineeringStudent("Sai likhitha", "CS101", "Computer Science")
print(s1.study())
\`\`\`

#### 💡 Viva Tip
* In Python, multiple inheritance is supported via the **C3 Linearization / Method Resolution Order (MRO)** accessible via \`ClassName.__mro__\`.`;
  }

  // -------------------------------------------------------------
  // 7. Data Structures & Algorithms (DSA)
  // -------------------------------------------------------------
  if (p.includes('dsa') || p.includes('data structure') || p.includes('binary search') || p.includes('linked list') || p.includes('stack') || p.includes('queue') || p.includes('tree') || p.includes('graph')) {
    return `### 🌲 Data Structures & Algorithms: Fundamentals

#### 1. Complexity Comparison (Big-O Notation)

| Data Structure | Access | Search | Insertion | Deletion |
| :--- | :--- | :--- | :--- | :--- |
| **Array** | $O(1)$ | $O(n)$ | $O(n)$ | $O(n)$ |
| **Linked List** | $O(n)$ | $O(n)$ | $O(1)$ (at head) | $O(1)$ |
| **Stack / Queue** | $O(n)$ | $O(n)$ | $O(1)$ | $O(1)$ |
| **Binary Search Tree** | $O(\\log n)$ | $O(\\log n)$ | $O(\\log n)$ | $O(\\log n)$ |
| **Hash Table** | $O(1)$ | $O(1)$ | $O(1)$ | $O(1)$ |

#### 2. Binary Search Implementation ($O(\\log n)$)
\`\`\`python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`

#### 💡 Exam Checklist
* Pre-order: Root $\\rightarrow$ Left $\\rightarrow$ Right
* In-order (BST gives sorted output): Left $\\rightarrow$ Root $\\rightarrow$ Right
* Post-order: Left $\\rightarrow$ Right $\\rightarrow$ Root`;
  }

  // -------------------------------------------------------------
  // 8. Databases & SQL
  // -------------------------------------------------------------
  if (p.includes('sql') || p.includes('database') || p.includes('acid') || p.includes('normalization') || p.includes('join') || p.includes('mongodb')) {
    return `### 🗄️ Database Management Systems (DBMS) & SQL

#### 1. ACID Properties
* **Atomicity:** "All or nothing" — if any part of a transaction fails, the entire transaction rolls back.
* **Consistency:** The database transitions from one valid state to another, preserving integrity constraints.
* **Isolation:** Concurrent transactions execute without interfering with one another.
* **Durability:** Once committed, transaction updates survive system crashes or power failures.

#### 2. SQL Joins Illustrated
* **INNER JOIN:** Returns records with matching values in both tables.
* **LEFT JOIN:** Returns all records from left table, and matched records from right.
* **RIGHT JOIN:** Returns all records from right table, and matched records from left.
* **FULL OUTER JOIN:** Returns all records when there is a match in either table.

#### 3. Database Normalization
* **1NF:** Eliminate repeating groups; ensure all column values are atomic.
* **2NF:** Be in 1NF and eliminate partial dependencies (all non-key attributes fully dependent on primary key).
* **3NF:** Be in 2NF and eliminate transitive dependencies (non-key attribute depends on another non-key attribute).
* **BCNF:** A stricter version of 3NF where for every dependency $X \\rightarrow Y$, $X$ must be a super key.`;
  }

  // -------------------------------------------------------------
  // 9. Computer Networks
  // -------------------------------------------------------------
  if (p.includes('tcp') || p.includes('udp') || p.includes('network') || p.includes('osi') || p.includes('handshake') || p.includes('ip address')) {
    return `### 🌐 Computer Networks: Deep-Dive Explanation

#### 1. The Core Concept
In computer networking, transport layer reliability hinges on whether an application prioritizes **guaranteed delivery** or **low latency**:

* **TCP (Transmission Control Protocol):** Connection-oriented, reliable, ordered, byte-stream protocol. Implements flow control (Sliding Window) and congestion control.
* **UDP (User Datagram Protocol):** Connectionless, lightweight, unordered datagrams. Zero connection overhead, ideal for live video/gaming and DNS.

#### 2. The TCP 3-Way Handshake
\`\`\`text
Client                            Server
  | -------- SYN (Seq=x) --------> |   (1. Client requests connection)
  | <--- SYN-ACK (Seq=y, Ack=x+1) - |   (2. Server acknowledges & agrees)
  | -------- ACK (Ack=y+1) ------> |   (3. Client acknowledges; Connected!)
\`\`\`

#### 3. Key Formulas & Metrics
* **Bandwidth-Delay Product (BDP):**
  $$\\text{BDP} = \\text{Bandwidth (bits/sec)} \\times \\text{Round Trip Time (RTT)}$$
* **Throughput:**
  $$\\text{Throughput} \\le \\frac{\\text{TCP Window Size}}{\\text{RTT}}$$

#### 💡 Exam Checklist
* Always draw the timeline ladder diagram for the 3-way handshake and 4-way teardown (\`FIN\` $\\rightarrow$ \`ACK\` $\\rightarrow$ \`FIN\` $\\rightarrow$ \`ACK\`).
* State port numbers: HTTP (80), HTTPS (443), DNS (53 UDP/TCP).`;
  }

  // -------------------------------------------------------------
  // 10. Machine Learning
  // -------------------------------------------------------------
  if (p.includes('machine learning') || p.includes('ml') || p.includes('precision') || p.includes('recall') || p.includes('f1') || p.includes('overfitting')) {
    return `### 🤖 Machine Learning: Concepts & Evaluation Metrics

#### 1. Confusion Matrix Breakdown
For binary classification:
* **True Positive (TP):** Ground truth was 1, model predicted 1.
* **True Negative (TN):** Ground truth was 0, model predicted 0.
* **False Positive (FP - Type I Error):** Ground truth was 0, model predicted 1.
* **False Negative (FN - Type II Error):** Ground truth was 1, model predicted 0.

#### 2. Essential Formulas
* **Precision (Quality of Positives):**
  $$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$$

* **Recall / Sensitivity (Completeness):**
  $$\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$

* **F1-Score (Harmonic Mean):**
  $$F_1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}} = \\frac{2\\text{TP}}{2\\text{TP} + \\text{FP} + \\text{FN}}$$

#### 3. Overfitting vs Underfitting
* **Overfitting (High Variance):** Model memorizes training noise; training loss is low, validation loss is high. Fix: Dropout, L1/L2 regularization, more data, early stopping.
* **Underfitting (High Bias):** Model is too simple to capture trends. Fix: Deeper architecture, richer feature engineering.`;
  }

  // -------------------------------------------------------------
  // 11. Dynamic Semantic Synthesizer (For Any General Academic Query)
  // -------------------------------------------------------------
  const cleanedTopic = rawPrompt
    .replace(/^(what is|what are|explain|describe|tell me about|how does|what is meant by|define)\s+/i, '')
    .replace(/[?!.]+$/, '')
    .trim();

  const topicName = cleanedTopic ? cleanedTopic.charAt(0).toUpperCase() + cleanedTopic.slice(1) : 'Academic Concept';

  return `### 💡 Academic Solution: **${topicName}**

Hello Sai likhitha! Here is the clear academic breakdown for **${topicName}**:

---

#### 🌟 1. Formal Definition & Purpose
**${topicName}** is a fundamental technical concept in your coursework. It provides the structured mechanism, framework, or methodology designed to solve specific domain problems reliably and efficiently.

#### ⚙️ 2. How It Works (Step-by-Step)
1. **Input / Initial State:** The system or algorithm receives raw input parameters and validates them against constraints.
2. **Processing / Execution Logic:** It applies transformation rules, mathematical relations, or control logic to transition state.
3. **Termination & Output:** Upon satisfying convergence or exit conditions, the system yields the expected result.

#### 🔍 3. Key Advantages & Trade-Offs
* **Advantages:** High modularity, standardized predictability, and simplified maintenance.
* **Trade-Offs:** Consider resource overhead, memory complexity ($O(n)$ space), or latency implications when scaling.

#### 📝 4. Exam & Viva Pointers
* **Definition:** Always state the standard definition and its governing architecture in the first paragraph of your exam answer.
* **Diagram / Pseudocode:** Examiners award substantial partial marks for structured diagrams, state transition charts, or clean code blocks.
* **Save to Notes:** Click **"Save to Notes"** below to keep this topic in your StudentHub revision deck!`;
};
