type ValidatorFn = (value: any, data: Record<string, any>) => string | null

interface FieldRules {
  required?: boolean
  validators?: ValidatorFn[]
}

export class Validator {

  private rules = new Map<string, FieldRules>()
  private errors = new Map<string, string>()

  register(name: string, rules: FieldRules) {
    this.rules.set(name, rules)
    if (rules.required) {
      this.errors.set(name, "Required")
    }
  }

  validateField(name: string, value: any, data: Record<string, any>) {

    const rule = this.rules.get(name)
    if (!rule) return null

    if (rule.required && !value) {
      this.errors.set(name, "Required")
      return "Required"
    }

    if (rule.validators) {
      for (const v of rule.validators) {
        const err = v(value, data)
        if (err) {
          this.errors.set(name, err)
          return err
        }
      }
    }

    this.errors.delete(name)
    return null
  }

  getError(name: string) {
    return this.errors.get(name)
  }

  isValid() {
    return this.errors.size === 0
  }
}