# Code Review with The Way of Code

*"The sage stays behind, thus he is ahead. He leads without commanding."* - Chapter 17

## Prompt Template

```
Please review the following code using The Way of Code principles:

**Code to Review:**
```
[PASTE CODE HERE]
```

**Review Focus:** [simplicity | flow | humility | balance | presence | all]

**Context:** [Optional: describe the problem this code solves]

---

**Review Guidelines:**

1. **Simplicity Over Complexity**
   - Is this the simplest solution that works?
   - Can any complexity be removed without losing functionality?
   - Are there simpler alternatives?

2. **Flow Over Force**
   - Does the code follow natural patterns?
   - Are there any places where the solution feels forced?
   - How could the logic flow more naturally?

3. **Humility Over Ego**
   - Is the code written for others to understand?
   - Are variable names and functions self-documenting?
   - Does it invite collaboration or intimidate?

4. **Balance Over Extremes**
   - Are trade-offs well-considered?
   - Is there appropriate error handling without over-engineering?
   - Does it balance current needs with future flexibility?

5. **Presence Over Rushing**
   - Does the code show attention to detail?
   - Are edge cases thoughtfully handled?
   - Is it production-ready or rushed?

Please provide specific suggestions aligned with these principles, focusing on both technical improvements and philosophical alignment.
```

## Example Usage

### Simple Function Review
```
Please review the following code using The Way of Code principles:

**Code to Review:**
```javascript
function getUserData(id) {
  if (!id) throw new Error("ID required");
  const user = database.users.find(u => u.id === id);
  if (!user) throw new Error("User not found");
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created: user.createdAt
  };
}
```

**Review Focus:** simplicity

**Context:** Fetching user data for profile display
```

### Complex System Review
```
Please review the following code using The Way of Code principles:

**Code to Review:**
```typescript
class UserService {
  private cache = new Map();
  private retryCount = 3;
  
  async getUser(id: string): Promise<User> {
    // ... complex caching and retry logic
  }
}
```

**Review Focus:** balance

**Context:** High-traffic user service that needs caching and resilience
```

## Philosophy in Practice

This template embodies The Way of Code by:

- **Simplicity**: Clear, focused review criteria
- **Flow**: Natural progression through the five pillars
- **Humility**: Asking for guidance rather than demanding changes
- **Balance**: Considering multiple perspectives
- **Presence**: Encouraging mindful, thorough review

*"The best code review is like water - essential but unnoticed, improving everything it touches."* 