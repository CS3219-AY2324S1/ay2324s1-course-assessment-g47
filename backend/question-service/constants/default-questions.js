const defaultQuestions = [
	{
		title: "Reverse a String",
		complexity: "Easy",
		category: ["String", "Algorithms"],
		upvotes: [],
		description:
			'<p>Write a function that reverses a string. The input string is given as an array of characters s.</p><p>You must do this by modifying the input array in-place with O(1) extra memory.</p><h4>Example 1:</h4><p>Input: s = ["h","e","l","l","o"]</p><p>Output: ["o","l","l","e","h"]</p><h4>Example 2:</h4><p>Input: s = ["H","a","n","n","a","h"]</p><p>Output: ["h","a","n","n","a","H"]</p><h4>Constraints:</h4><ul><li>1 <= s.length <= 105</li><li>s[i] is a printable ASCII character.</li></ul>',
	},
	{
		title: "Linked List Cycle Detection",
		complexity: "Easy",
		category: ["Data Structures", "Algorithms"],
		upvotes: [],
		description:
			"<p>Given head, the head of a linked list, determine if the linked list has a cycle in it.</p><p><br></p><p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.</p><p><br></p><p>Return true if there is a cycle in the linked list. Otherwise, return false.</p><p><br></p><p>Example 1:</p><p>Input: head = [3,2,0,-4], pos = 1</p><p>Output: true</p><p>Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).</p><p><br></p><p>Example 2:</p><p>Input: head = [1,2], pos = 0</p><p>Output: true</p><p>Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.</p><p><br></p><p>Example 3:</p><p>Input: head = [1], pos = -1</p><p>Output: false</p><p>Explanation: There is no cycle in the linked list.</p><p>&nbsp;</p><p>Constraints:</p><ul><li>The number of the nodes in the list is in the range [0, 10<sup>4</sup>].</li><li>-10<sup>5</sup> &lt;= Node.val &lt;= 10<sup>5</sup></li><li>pos is -1 or a valid index in the linked-list.</li></ul><p>&nbsp;</p><p>Follow up: Can you solve it using O(1) (i.e. constant) memory?</p>",
	},
	{
		title: "Roman to Integer",
		complexity: "Easy",
		category: ["Algorithms"],
		upvotes: [],
		description:
			"<p>Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.</p><p><br></p><p>Symbol&nbsp;&nbsp;&nbsp;&nbsp;Value</p><p>I&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;         &nbsp;1</p><p>V&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;        &nbsp;&nbsp;5</p><p>X&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       &nbsp;10</p><p>L&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;        50</p><p>C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       100</p><p>D&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       &nbsp;500</p><p>M&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      1000</p><p><br></p><p>For example, 2 is written as II in Roman numeral, just two ones added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.</p><p><br></p><p>Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:</p><p><br></p><ul><li>I can be placed before V (5) and X (10) to make 4 and 9.&nbsp;</li><li>X can be placed before L (50) and C (100) to make 40 and 90.&nbsp;</li><li>C can be placed before D (500) and M (1000) to make 400 and 900.</li></ul><p><br></p><p>Given a roman numeral, convert it to an integer.</p><p><br></p><p>Example 1:</p><p>Input: s = \"III\"</p><p>Output: 3</p><p>Explanation: III = 3.</p><p><br></p><p>Example 2:</p><p>Input: s = \"LVIII\"</p><p>Output: 58</p><p>Explanation: L = 50, V= 5, III = 3.</p><p><br></p><p>Example 3:</p><p>Input: s = \"MCMXCIV\"</p><p>Output: 1994</p><p>Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.</p><p>&nbsp;</p><p><br></p><p>Constraints:</p><ul><li>1 &lt;= s.length &lt;= 15</li><li>s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').</li><li>It is guaranteed that s is a valid roman numeral in the range [1, 3999].</li></ul>",
	},
	{
		title: "Add Binary",
		complexity: "Easy",
		category: ["Bit Manipulation", "Algorithms"],
		upvotes: [],
		description:
			'<p>Given two binary strings a and b, return their sum as a binary string.</p><p><br></p><p>Example 1:</p><p>Input: a = "11", b = "1"</p><p>Output: "100"</p><p><br></p><p>Example 2:</p><p>Input: a = "1010", b = "1011"</p><p>Output: "10101"</p><p>&nbsp;</p><p><br></p><p>Constraints:</p><ul><li>1 &lt;= a.length, b.length &lt;= 104</li><li>a and b consist only of \'0\' or \'1\' characters.</li><li>Each string does not contain leading zeros except for the zero itself.</li></ul>',
	},
	{
		title: "Fibonacci Number",
		complexity: "Easy",
		category: ["Recursion", "Algorithms"],
		upvotes: [],
		description:
			"<p>The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is,</p><p><br></p><p>F(0) = 0, F(1) = 1</p><p>F(n) = F(n - 1) + F(n - 2), for n &gt; 1.</p><p>Given n, calculate F(n).</p><p><br></p><p>Example 1:</p><p>Input: n = 2</p><p>Output: 1</p><p>Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1.</p><p><br></p><p>Example 2:</p><p>Input: n = 3</p><p>Output: 2</p><p>Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2.</p><p><br></p><p>Example 3:</p><p>Input: n = 4</p><p>Output: 3</p><p>Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3.</p><p>&nbsp;</p><p><br></p><p>Constraints:</p><ul><li>0 &lt;= n &lt;= 30</li></ul>",
	},
	{
		title: "Implement Stack using Queues",
		complexity: "Easy",
		category: ["Data Structures"],
		upvotes: [],
		description:
			'<p>Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).</p><p><br></p><p>Implement the MyStack class:</p><ul><li>void push(int x) Pushes element x to the top of the stack.</li><li>int pop() Removes the element on the top of the stack and returns it.</li><li>int top() Returns the element on the top of the stack.</li><li>boolean empty() Returns true if the stack is empty, false otherwise.</li></ul><p><br></p><p>Notes:</p><ul><li>You must use only standard operations of a queue, which means that only push to back, peek/pop from front, size and is empty operations are valid.</li><li>Depending on your language, the queue may not be supported natively. You may simulate a queue using a list or deque (double-ended queue) as long as you use only a queue\'s standard operations.</li></ul><p>&nbsp;</p><p><br></p><p>Example 1:</p><p>Input</p><p>["MyStack", "push", "push", "top", "pop", "empty"]</p><p>[[], [1], [2], [], [], []]</p><p>Output</p><p>[null, null, null, 2, 2, false]</p><p><br></p><p>Explanation</p><p>MyStack myStack = new MyStack();</p><p>myStack.push(1);</p><p>myStack.push(2);</p><p>myStack.top(); // return 2</p><p>myStack.pop(); // return 2</p><p>myStack.empty(); // return False</p><p><br></p><p>Constraints:</p><ul><li>1 &lt;= x &lt;= 9</li><li>At most 100 calls will be made to push, pop, top, and empty.</li><li>All the calls to pop and top are valid.</li></ul>',
	},
	{
		title: "Combine Two Tables",
		complexity: "Easy",
		category: ["Databases"],
		upvotes: [],
		description:
			"<p>Table: Person</p><p><br></p><p>+-------------+---------+</p><p>| Column Name | Type&nbsp;&nbsp;|</p><p>+-------------+---------+</p><p>| personId&nbsp;&nbsp;| int&nbsp;&nbsp;&nbsp;|</p><p>| lastName&nbsp;&nbsp;| varchar |</p><p>| firstName&nbsp;&nbsp;| varchar |</p><p>+-------------+---------+</p><p>personId is the primary key (column with unique values) for this table.</p><p>This table contains information about the ID of some persons and their first and last names.</p><p>&nbsp;</p><p>Table: Address</p><p><br></p><p>+-------------+---------+</p><p>| Column Name | Type&nbsp;&nbsp;|</p><p>+-------------+---------+</p><p>| addressId&nbsp;&nbsp;| int&nbsp;&nbsp;&nbsp;|</p><p>| personId&nbsp;&nbsp;| int&nbsp;&nbsp;&nbsp;|</p><p>| city&nbsp;&nbsp;&nbsp;&nbsp;| varchar |</p><p>| state&nbsp;&nbsp;&nbsp;&nbsp;| varchar |</p><p>+-------------+---------+</p><p>addressId is the primary key (column with unique values) for this table.</p><p>Each row of this table contains information about the city and state of one person with ID = PersonId.</p><p>&nbsp;</p><p>Write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead.</p><p><br></p><p>Return the result table in any order.</p><p><br></p><p>The result format is in the following example.</p><p><br></p><p>Example 1:</p><p><br></p><p>Input:&nbsp;</p><p>Person table:</p><p>+----------+----------+-----------+</p><p>| personId | lastName | firstName |</p><p>+----------+----------+-----------+</p><p>| 1&nbsp;&nbsp;&nbsp;&nbsp;| Wang&nbsp;&nbsp;&nbsp;| Allen&nbsp;&nbsp;&nbsp;|</p><p>| 2&nbsp;&nbsp;&nbsp;&nbsp;| Alice&nbsp;&nbsp;| Bob&nbsp;&nbsp;&nbsp;&nbsp;|</p><p>+----------+----------+-----------+</p><p>Address table:</p><p>+-----------+----------+---------------+------------+</p><p>| addressId | personId | city&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| state&nbsp;&nbsp;&nbsp;|</p><p>+-----------+----------+---------------+------------+</p><p>| 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 2&nbsp;&nbsp;&nbsp;&nbsp;| New York City | New York&nbsp;&nbsp;|</p><p>| 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 3&nbsp;&nbsp;&nbsp;&nbsp;| Leetcode&nbsp;&nbsp;&nbsp;| California |</p><p>+-----------+----------+---------------+------------+</p><p>Output:&nbsp;</p><p>+-----------+----------+---------------+----------+</p><p>| firstName | lastName | city&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| state&nbsp;&nbsp;|</p><p>+-----------+----------+---------------+----------+</p><p>| Allen&nbsp;&nbsp;&nbsp;| Wang&nbsp;&nbsp;&nbsp;| Null&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| Null&nbsp;&nbsp;&nbsp;|</p><p>| Bob&nbsp;&nbsp;&nbsp;&nbsp;| Alice&nbsp;&nbsp;| New York City | New York |</p><p>+-----------+----------+---------------+----------+</p><p>Explanation:&nbsp;</p><p>There is no address in the address table for the personId = 1 so we return null in their city and state.</p><p>addressId = 1 contains information about the address of personId = 2.</p>",
	},
	{
		title: "Repeated DNA Sequences",
		complexity: "Medium",
		category: ["Algorithms", "Bit Manipulation"],
		upvotes: [],
		description:
			"<p>The DNA sequence is composed of a series of nucleotides abbreviated as 'A', 'C', 'G', and 'T'.</p><ul><li>For example, \"ACGAATTCCG\" is a DNA sequence.</li></ul><p>When studying DNA, it is useful to identify repeated sequences within the DNA.</p><p><br></p><p>Given a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule. You may return the answer in any order.</p><p><br></p><p>Example 1:</p><p>Input: s = \"AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT\"</p><p>Output: [\"AAAAACCCCC\",\"CCCCCAAAAA\"]</p><p><br></p><p>Example 2:</p><p>Input: s = \"AAAAAAAAAAAAA\"</p><p>Output: [\"AAAAAAAAAA\"]</p><p>&nbsp;</p><p>Constraints:</p><ul><li>1 &lt;= s.length &lt;= 105</li><li>s[i] is either 'A', 'C', 'G', or 'T'.</li></ul>",
	},
	{
		title: "Course Schedule",
		complexity: "Medium",
		category: ["Data Structures", "Algorithms"],
		upvotes: [],
		description:
			"<p>There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a<sub>i</sub>, b<sub>i</sub>] indicates that you must take course bi first if you want to take course ai.</p><p><br></p><p>For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.</p><p>Return true if you can finish all courses. Otherwise, return false.</p><p><br></p><p>Example 1:</p><p>Input: numCourses = 2, prerequisites = [[1,0]]</p><p>Output: true</p><p>Explanation: There are a total of 2 courses to take.&nbsp;</p><p>To take course 1 you should have finished course 0. So it is possible.</p><p><br></p><p>Example 2:</p><p>Input: numCourses = 2, prerequisites = [[1,0],[0,1]]</p><p>Output: false</p><p>Explanation: There are a total of 2 courses to take.&nbsp;</p><p>To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.</p><p>&nbsp;</p><p><br></p><p>Constraints:</p><p>1 &lt;= numCourses &lt;= 2000</p><p>0 &lt;= prerequisites.length &lt;= 5000</p><p>prerequisites[i].length == 2</p><p>0 &lt;= a<sub>i</sub>, b<sub>i </sub>&lt; numCourses</p><p>All the pairs prerequisites[i] are unique.</p>",
	},
	{
		title: "LRU Cache Design",
		complexity: "Medium",
		category: ["Data Structures"],
		upvotes: [],
		description:
			'<p>Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.</p><p><br></p><p>Implement the LRUCache class:</p><ul><li>LRUCache(int capacity) Initialize the LRU cache with positive size capacity.</li><li>int get(int key) Return the value of the key if the key exists, otherwise return -1.</li><li>void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.</li></ul><p><br></p><p>The functions get and put must each run in O(1) average time complexity.</p><p><br></p><p>Example 1:</p><p>Input</p><p>["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]</p><p>[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]</p><p>Output</p><p>[null, null, null, 1, null, -1, null, -1, 3, 4]</p><p><br></p><p>Explanation</p><p>LRUCache lRUCache = new LRUCache(2);</p><p>lRUCache.put(1, 1); // cache is {1=1}</p><p>lRUCache.put(2, 2); // cache is {1=1, 2=2}</p><p>lRUCache.get(1);&nbsp;&nbsp;// return 1</p><p>lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}</p><p>lRUCache.get(2);&nbsp;&nbsp;// returns -1 (not found)</p><p>lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}</p><p>lRUCache.get(1);&nbsp;&nbsp;// return -1 (not found)</p><p>lRUCache.get(3);&nbsp;&nbsp;// return 3</p><p>lRUCache.get(4);&nbsp;&nbsp;// return 4</p><p><br></p><p>Constraints:</p><ul><li>1 &lt;= capacity &lt;= 3000</li><li>0 &lt;= key &lt;= 104</li><li>0 &lt;= value &lt;= 105</li><li>At most 2 * 105 calls will be made to get and put.</li></ul>',
	},
	{
		title: "Longest Common Subsequence",
		complexity: "Medium",
		category: ["Algorithms", "String"],
		upvotes: [],
		description:
			'<p>Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.</p><p><br></p><p>A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.</p><ul><li>For example, "ace" is a subsequence of "abcde".</li></ul><p><br></p><p>A common subsequence of two strings is a subsequence that is common to both strings.</p><p><br></p><p>Example 1:</p><p>Input: text1 = "abcde", text2 = "ace"&nbsp;</p><p>Output: 3&nbsp;&nbsp;</p><p>Explanation: The longest common subsequence is "ace" and its length is 3.</p><p><br></p><p>Example 2:</p><p>Input: text1 = "abc", text2 = "abc"</p><p>Output: 3</p><p>Explanation: The longest common subsequence is "abc" and its length is 3.</p><p><br></p><p>Example 3:</p><p>Input: text1 = "abc", text2 = "def"</p><p>Output: 0</p><p>Explanation: There is no such common subsequence, so the result is 0.</p><p>&nbsp;</p><p>Constraints:</p><ul><li>1 &lt;= text1.length, text2.length &lt;= 1000</li><li>text1 and text2 consist of only lowercase English characters.</li></ul>',
	},
	{
		title: "Rotate Image",
		complexity: "Medium",
		category: ["Algorithms", "Arrays"],
		upvotes: [],
		description:
			"<p>You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).</p><p><br></p><p>You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.</p><p><br></p><p>Example 1:</p><p>Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]</p><p>Output: [[7,4,1],[8,5,2],[9,6,3]]</p><p><br></p><p>Example 2:</p><p>Input: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]</p><p>Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]</p><p>&nbsp;</p><p>Constraints:</p><ul><li>n == matrix.length == matrix[i].length</li><li>1 &lt;= n &lt;= 20</li><li>-1000 &lt;= matrix[i][j] &lt;= 1000</li></ul>",
	},
	{
		title: "Airplane Seat Assignment Probability",
		complexity: "Medium",
		category: ["Brainteaser"],
		upvotes: [],
		description:
			"<p>n passengers board an airplane with exactly n seats. The first passenger has lost the ticket and picks a seat randomly. But after that, the rest of the passengers will:</p><ul><li>Take their own seat if it is still available, and</li><li>Pick other seats randomly when they find their seat occupied</li></ul><p>Return the probability that the n<sup>th</sup> person gets his own seat.</p><p><br></p><p>Example 1:</p><p>Input: n = 1</p><p>Output: 1.00000</p><p>Explanation: The first person can only get the first seat.</p><p><br></p><p>Example 2:</p><p>Input: n = 2</p><p>Output: 0.50000</p><p>Explanation: The second person has a probability of 0.5 to get the second seat (when first person gets the first seat).</p><p><br></p><p>Constraints:</p><ul><li>1 &lt;= n &lt;= 10<sup>5</sup></li></ul>",
	},
	{
		title: "Validate Binary Search Tree",
		complexity: "Medium",
		category: ["Algorithms", "Data Structures"],
		upvotes: [],
		description:
			"<p>Given the root of a binary tree, determine if it is a valid binary search tree (BST).</p><p><br></p><p>A valid BST is defined as follows:</p><ul><li>The left&nbsp;subtree of a node contains only nodes with keys less than the node's key.</li><li>The right subtree of a node contains only nodes with keys greater than the node's key.</li><li>Both the left and right subtrees must also be binary search trees.</li></ul><p>&nbsp;</p><p>Example 1:</p><p>Input: root = [2,1,3]</p><p>Output: true</p><p><br></p><p>Example 2:</p><p>Input: root = [5,1,4,null,null,3,6]</p><p>Output: false</p><p>Explanation: The root node's value is 5 but its right child's value is 4.</p><p><br></p><p>Constraints:</p><ul><li>The number of nodes in the tree is in the range [1, 10<sup>4</sup>].</li><li>-2<sup>31</sup> &lt;= Node.val &lt;= 2<sup>31</sup> - 1</li></ul>",
	},
	{
		title: "Sliding Window Maximum",
		complexity: "Hard",
		category: ["Algorithms", "Arrays"],
		upvotes: [],
		description:
			"<p>You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.</p><p><br></p><p>Return the max sliding window.</p><p><br></p><p>Example 1:</p><p>Input: nums = [1,3,-1,-3,5,3,6,7], k = 3</p><p>Output: [3,3,5,5,6,7]</p><p>Explanation:&nbsp;</p><p>Window position&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max</p><p>---------------&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;        -----</p><p>[1&nbsp;3&nbsp;-1] -3&nbsp;5&nbsp;3&nbsp;6&nbsp;7&nbsp;&nbsp;&nbsp;&nbsp;   3</p><p>&nbsp;1 [3&nbsp;-1&nbsp;-3] 5&nbsp;3&nbsp;6&nbsp;7&nbsp;&nbsp;&nbsp;&nbsp;  3</p><p>&nbsp;1&nbsp;3 [-1&nbsp;-3&nbsp;5] 3&nbsp;6&nbsp;7&nbsp;&nbsp;&nbsp;&nbsp;  5</p><p>&nbsp;1&nbsp;3&nbsp;-1 [-3&nbsp;5&nbsp;3] 6&nbsp;7&nbsp;&nbsp;&nbsp;  &nbsp;5</p><p>&nbsp;1&nbsp;3&nbsp;-1&nbsp;-3 [5&nbsp;3&nbsp;6] 7&nbsp;&nbsp;&nbsp;  &nbsp;6</p><p>&nbsp;1&nbsp;3&nbsp;-1&nbsp;-3&nbsp;5 [3&nbsp;6&nbsp;7]&nbsp;&nbsp;&nbsp;7</p><p><br></p><p>Example 2:</p><p>Input: nums = [1], k = 1</p><p>Output: [1]</p><p>&nbsp;</p><p>Constraints:</p><ul><li>1 &lt;= nums.length &lt;= 10<sup>5</sup></li><li>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></li><li>1 &lt;= k &lt;= nums.length</li></ul>",
	},
	{
		title: "N-Queen",
		complexity: "Hard",
		category: ["Algorithms"],
		upvotes: [],
		description:
			'<p>The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.</p><p><br></p><p>Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.</p><p><br></p><p>Each solution contains a distinct board configuration of the n-queens\' placement, where \'Q\' and \'.\' both indicate a queen and an empty space, respectively.</p><p><br></p><p>Example 1:</p><p>Input: n = 4</p><p>Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]</p><p>Explanation: There exist two distinct solutions to the 4-queens puzzle as shown above</p><p><br></p><p>Example 2:</p><p>Input: n = 1</p><p>Output: [["Q"]]</p><p>&nbsp;</p><p>Constraints:</p><ul><li>1 &lt;= n &lt;= 9</li></ul>',
	},
	{
		title: "Serialize and Deserialize Binary Tree",
		complexity: "Hard",
		category: ["Algorithms", "Data Structures"],
		upvotes: [],
		description:
			"<p>Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.</p><p><br></p><p>Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.</p><p><br></p><p>Clarification: The input/output format is the same as how LeetCode serializes a binary tree. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.</p><p><br></p><p>Example 1:</p><p>Input: root = [1,2,3,null,null,4,5]</p><p>Output: [1,2,3,null,null,4,5]</p><p><br></p><p>Example 2:</p><p>Input: root = []</p><p>Output: []</p><p>&nbsp;</p><p>Constraints:</p><ul><li>The number of nodes in the tree is in the range [0, 10<sup>4</sup>].</li><li>-1000 &lt;= Node.val &lt;= 1000</li></ul>",
	},
	{
		title: "Wildcard Matching",
		complexity: "Hard",
		category: ["Algorithms", "String"],
		upvotes: [],
		description:
			"<p>Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:</p><ul><li>'?' Matches any single character.</li><li>'*' Matches any sequence of characters (including the empty sequence).</li></ul><p>The matching should cover the entire input string (not partial).</p><p><br></p><p>Example 1:</p><p>Input: s = \"aa\", p = \"a\"</p><p>Output: false</p><p>Explanation: \"a\" does not match the entire string \"aa\".</p><p><br></p><p>Example 2:</p><p>Input: s = \"aa\", p = \"*\"</p><p>Output: true</p><p>Explanation: '*' matches any sequence.</p><p><br></p><p>Example 3:</p><p>Input: s = \"cb\", p = \"?a\"</p><p>Output: false</p><p>Explanation: '?' matches 'c', but the second letter is 'a', which does not match 'b'.</p><p>&nbsp;</p><p><br></p><p>Constraints:</p><ul><li>0 &lt;= s.length, p.length &lt;= 2000</li><li>s contains only lowercase English letters.</li><li>p contains only lowercase English letters, '?' or '*'.</li></ul>",
	},
	{
		title: "Chalkboard XOR Game",
		complexity: "Hard",
		category: ["Algorithms", "Data Structures"],
		upvotes: [],
		description:
			"<p>You are given an array of integers nums represents the numbers written on a chalkboard.</p><p><br></p><p>Alice and Bob take turns erasing exactly one number from the chalkboard, with Alice starting first. If erasing a number causes the bitwise XOR of all the elements of the chalkboard to become 0, then that player loses. The bitwise XOR of one element is that element itself, and the bitwise XOR of no elements is 0.</p><p><br></p><p>Also, if any player starts their turn with the bitwise XOR of all the elements of the chalkboard equal to 0, then that player wins.</p><p><br></p><p>Return true if and only if Alice wins the game, assuming both players play optimally.</p><p><br></p><p>Example 1:</p><p>Input: nums = [1,1,2]</p><p>Output: false</p><p>Explanation:&nbsp;</p><p>Alice has two choices: erase 1 or erase 2.&nbsp;</p><p>If she erases 1, the nums array becomes [1, 2]. The bitwise XOR of all the elements of the chalkboard is 1 XOR 2 = 3. Now Bob can remove any element he wants, because Alice will be the one to erase the last element and she will lose.&nbsp;</p><p>If Alice erases 2 first, now nums become [1, 1]. The bitwise XOR of all the elements of the chalkboard is 1 XOR 1 = 0. Alice will lose.</p><p><br></p><p>Example 2:</p><p>Input: nums = [0,1]</p><p>Output: true</p><p><br></p><p>Example 3:</p><p>Input: nums = [1,2,3]</p><p>Output: true</p><p>&nbsp;</p><p>Constraints:</p><ul><li>1 &lt;= nums.length &lt;= 1000</li><li>0 &lt;= nums[i] &lt; 2<sup>16</sup></li></ul>",
	},
	{
		title: "Trips and Users",
		complexity: "Hard",
		category: ["Algorithms", "Data Structures"],
		upvotes: [],
		description:
			"<p>Table: Trips</p><p><br></p><p>+-------------+----------+</p><p>| Column Name | Type&nbsp;&nbsp;&nbsp;|</p><p>+-------------+----------+</p><p>| id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| int&nbsp;&nbsp;&nbsp;|</p><p>| client_id&nbsp;&nbsp;| int&nbsp;&nbsp;&nbsp;|</p><p>| driver_id&nbsp;&nbsp;| int&nbsp;&nbsp;&nbsp;|</p><p>| city_id&nbsp;&nbsp;&nbsp;| int&nbsp;&nbsp;&nbsp;|</p><p>| status&nbsp;&nbsp;&nbsp;| enum&nbsp;&nbsp;&nbsp;|</p><p>| request_at&nbsp;| date&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</p><p>+-------------+----------+</p><p>id is the primary key (column with unique values) for this table.</p><p>The table holds all taxi trips. Each trip has a unique id, while client_id and driver_id are foreign keys to the users_id at the Users table.</p><p>Status is an ENUM (category) type of ('completed', 'cancelled_by_driver', 'cancelled_by_client').</p><p>&nbsp;</p><p><br></p><p>Table: Users</p><p><br></p><p>+-------------+----------+</p><p>| Column Name | Type&nbsp;&nbsp;&nbsp;|</p><p>+-------------+----------+</p><p>| users_id&nbsp;&nbsp;| int&nbsp;&nbsp;&nbsp;|</p><p>| banned&nbsp;&nbsp;&nbsp;| enum&nbsp;&nbsp;&nbsp;|</p><p>| role&nbsp;&nbsp;&nbsp;&nbsp;| enum&nbsp;&nbsp;&nbsp;|</p><p>+-------------+----------+</p><p>users_id is the primary key (column with unique values) for this table.</p><p>The table holds all users. Each user has a unique users_id, and role is an ENUM type of ('client', 'driver', 'partner').</p><p>banned is an ENUM (category) type of ('Yes', 'No').</p><p>&nbsp;</p><p><br></p><p>The cancellation rate is computed by dividing the number of canceled (by client or driver) requests with unbanned users by the total number of requests with unbanned users on that day.</p><p><br></p><p>Write a solution to find the cancellation rate of requests with unbanned users (both client and driver must not be banned) each day between \"2013-10-01\" and \"2013-10-03\". Round Cancellation Rate to two decimal points.</p><p><br></p><p>Return the result table in any order.</p><p><br></p><p>The result format is in the following example.</p><p><br></p><p>&nbsp;</p><p><br></p><p>Example 1:</p><p><br></p><p>Input:&nbsp;</p><p>Trips table:</p><p>+----+-----------+-----------+---------+---------------------+------------+</p><p>| id | client_id | driver_id | city_id | status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| request_at |</p><p>+----+-----------+-----------+---------+---------------------+------------+</p><p>| 1&nbsp;| 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 10&nbsp;&nbsp;&nbsp;&nbsp;| 1&nbsp;&nbsp;&nbsp;&nbsp;| completed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 2013-10-01 |</p><p>| 2&nbsp;| 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 11&nbsp;&nbsp;&nbsp;&nbsp;| 1&nbsp;&nbsp;&nbsp;&nbsp;| cancelled_by_driver | 2013-10-01 |</p><p>| 3&nbsp;| 3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 12&nbsp;&nbsp;&nbsp;&nbsp;| 6&nbsp;&nbsp;&nbsp;&nbsp;| completed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 2013-10-01 |</p><p>| 4&nbsp;| 4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 13&nbsp;&nbsp;&nbsp;&nbsp;| 6&nbsp;&nbsp;&nbsp;&nbsp;| cancelled_by_client | 2013-10-01 |</p><p>| 5&nbsp;| 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 10&nbsp;&nbsp;&nbsp;&nbsp;| 1&nbsp;&nbsp;&nbsp;&nbsp;| completed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 2013-10-02 |</p><p>| 6&nbsp;| 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 11&nbsp;&nbsp;&nbsp;&nbsp;| 6&nbsp;&nbsp;&nbsp;&nbsp;| completed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 2013-10-02 |</p><p>| 7&nbsp;| 3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 12&nbsp;&nbsp;&nbsp;&nbsp;| 6&nbsp;&nbsp;&nbsp;&nbsp;| completed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 2013-10-02 |</p><p>| 8&nbsp;| 2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 12&nbsp;&nbsp;&nbsp;&nbsp;| 12&nbsp;&nbsp;&nbsp;| completed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 2013-10-03 |</p><p>| 9&nbsp;| 3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 10&nbsp;&nbsp;&nbsp;&nbsp;| 12&nbsp;&nbsp;&nbsp;| completed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 2013-10-03 |</p><p>| 10 | 4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 13&nbsp;&nbsp;&nbsp;&nbsp;| 12&nbsp;&nbsp;&nbsp;| cancelled_by_driver | 2013-10-03 |</p><p>+----+-----------+-----------+---------+---------------------+------------+</p><p>Users table:</p><p>+----------+--------+--------+</p><p>| users_id | banned | role&nbsp;&nbsp;|</p><p>+----------+--------+--------+</p><p>| 1&nbsp;&nbsp;&nbsp;&nbsp;| No&nbsp;&nbsp;&nbsp;| client |</p><p>| 2&nbsp;&nbsp;&nbsp;&nbsp;| Yes&nbsp;&nbsp;| client |</p><p>| 3&nbsp;&nbsp;&nbsp;&nbsp;| No&nbsp;&nbsp;&nbsp;| client |</p><p>| 4&nbsp;&nbsp;&nbsp;&nbsp;| No&nbsp;&nbsp;&nbsp;| client |</p><p>| 10&nbsp;&nbsp;&nbsp;&nbsp;| No&nbsp;&nbsp;&nbsp;| driver |</p><p>| 11&nbsp;&nbsp;&nbsp;&nbsp;| No&nbsp;&nbsp;&nbsp;| driver |</p><p>| 12&nbsp;&nbsp;&nbsp;&nbsp;| No&nbsp;&nbsp;&nbsp;| driver |</p><p>| 13&nbsp;&nbsp;&nbsp;&nbsp;| No&nbsp;&nbsp;&nbsp;| driver |</p><p>+----------+--------+--------+</p><p>Output:&nbsp;</p><p>+------------+-------------------+</p><p>| Day&nbsp;&nbsp;&nbsp;&nbsp;| Cancellation Rate |</p><p>+------------+-------------------+</p><p>| 2013-10-01 | 0.33&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|</p><p>| 2013-10-02 | 0.00&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|</p><p>| 2013-10-03 | 0.50&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|</p><p>+------------+-------------------+</p><p>Explanation:&nbsp;</p><p>On 2013-10-01:</p><p>&nbsp;- There were 4 requests in total, 2 of which were canceled.</p><p>&nbsp;- However, the request with Id=2 was made by a banned client (User_Id=2), so it is ignored in the calculation.</p><p>&nbsp;- Hence there are 3 unbanned requests in total, 1 of which was canceled.</p><p>&nbsp;- The Cancellation Rate is (1 / 3) = 0.33</p><p>On 2013-10-02:</p><p>&nbsp;- There were 3 requests in total, 0 of which were canceled.</p><p>&nbsp;- The request with Id=6 was made by a banned client, so it is ignored.</p><p>&nbsp;- Hence there are 2 unbanned requests in total, 0 of which were canceled.</p><p>&nbsp;- The Cancellation Rate is (0 / 2) = 0.00</p><p>On 2013-10-03:</p><p>&nbsp;- There were 3 requests in total, 1 of which was canceled.</p><p>&nbsp;- The request with Id=8 was made by a banned client, so it is ignored.</p><p>&nbsp;- Hence there are 2 unbanned request in total, 1 of which were canceled.</p><p>&nbsp;- The Cancellation Rate is (1 / 2) = 0.50</p>",
	},

	// Add more questions as needed
];

module.exports = defaultQuestions;
