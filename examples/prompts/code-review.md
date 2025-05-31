# Code Review — The Way

*"The sage stays behind, thus he is ahead."*

## Usage

```javascript
const prompt = await client.getPrompt("code_review_with_tao", {
  code: source,
  focus: "simplicity"
});
```

## Template

```
Review this code following The Way:

**Code:**
```
[PASTE CODE HERE]
```

**Focus:** [simplicity | flow | humility | balance | presence]

---

**The Five Pillars:**

**Simplicity** — Is this the simplest solution that works?  
**Flow** — Does it follow natural patterns?  
**Humility** — Is it written for others to understand?  
**Balance** — Are trade-offs well-considered?  
**Presence** — Does it show attention to detail?

Provide guidance aligned with these principles.
```

## Examples

### Function Review
```
Review this code following The Way:

**Code:**
```javascript
function getUser(id) {
  if (!id) throw new Error("ID required");
  const user = db.find(u => u.id === id);
  if (!user) throw new Error("User not found");
  return { id: user.id, name: user.name, email: user.email };
}
```

**Focus:** simplicity
```

### System Review
```
Review this code following The Way:

**Code:**
```typescript
class UserService {
  private cache = new Map();
  async getUser(id: string): Promise<User> {
    // complex caching logic
  }
}
```

**Focus:** balance
```

---

*The best review improves the code without diminishing the coder.* 