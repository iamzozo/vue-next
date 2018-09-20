import { observable, autorun, unwrap, isObservable } from '../../src'

describe('observer/collections', () => {
  describe('Map', () => {
    test('instanceof', () => {
      const original = new Map()
      const observed = observable(original)
      expect(isObservable(observed)).toBe(true)
      expect(original instanceof Map).toBe(true)
      expect(observed instanceof Map).toBe(true)
    })

    it('should observe mutations', () => {
      let dummy
      const map = observable(new Map())
      autorun(() => {
        dummy = map.get('key')
      })

      expect(dummy).toBe(undefined)
      map.set('key', 'value')
      expect(dummy).toBe('value')
      map.set('key', 'value2')
      expect(dummy).toBe('value2')
      map.delete('key')
      expect(dummy).toBe(undefined)
    })

    it('should observe size mutations', () => {
      let dummy
      const map = observable(new Map())
      autorun(() => (dummy = map.size))

      expect(dummy).toBe(0)
      map.set('key1', 'value')
      map.set('key2', 'value2')
      expect(dummy).toBe(2)
      map.delete('key1')
      expect(dummy).toBe(1)
      map.clear()
      expect(dummy).toBe(0)
    })

    it('should observe for of iteration', () => {
      let dummy
      const map = observable(new Map())
      autorun(() => {
        dummy = 0
        // eslint-disable-next-line no-unused-vars
        for (let [key, num] of map) {
          key
          dummy += num
        }
      })

      expect(dummy).toBe(0)
      map.set('key1', 3)
      expect(dummy).toBe(3)
      map.set('key2', 2)
      expect(dummy).toBe(5)
      map.delete('key1')
      expect(dummy).toBe(2)
      map.clear()
      expect(dummy).toBe(0)
    })

    it('should observe forEach iteration', () => {
      let dummy: any
      const map = observable(new Map())
      autorun(() => {
        dummy = 0
        map.forEach((num: any) => (dummy += num))
      })

      expect(dummy).toBe(0)
      map.set('key1', 3)
      expect(dummy).toBe(3)
      map.set('key2', 2)
      expect(dummy).toBe(5)
      map.delete('key1')
      expect(dummy).toBe(2)
      map.clear()
      expect(dummy).toBe(0)
    })

    it('should observe keys iteration', () => {
      let dummy
      const map = observable(new Map())
      autorun(() => {
        dummy = 0
        for (let key of map.keys()) {
          dummy += key
        }
      })

      expect(dummy).toBe(0)
      map.set(3, 3)
      expect(dummy).toBe(3)
      map.set(2, 2)
      expect(dummy).toBe(5)
      map.delete(3)
      expect(dummy).toBe(2)
      map.clear()
      expect(dummy).toBe(0)
    })

    it('should observe values iteration', () => {
      let dummy
      const map = observable(new Map())
      autorun(() => {
        dummy = 0
        for (let num of map.values()) {
          dummy += num
        }
      })

      expect(dummy).toBe(0)
      map.set('key1', 3)
      expect(dummy).toBe(3)
      map.set('key2', 2)
      expect(dummy).toBe(5)
      map.delete('key1')
      expect(dummy).toBe(2)
      map.clear()
      expect(dummy).toBe(0)
    })

    it('should observe entries iteration', () => {
      let dummy
      const map = observable(new Map())
      autorun(() => {
        dummy = 0
        // eslint-disable-next-line no-unused-vars
        for (let [key, num] of map.entries()) {
          key
          dummy += num
        }
      })

      expect(dummy).toBe(0)
      map.set('key1', 3)
      expect(dummy).toBe(3)
      map.set('key2', 2)
      expect(dummy).toBe(5)
      map.delete('key1')
      expect(dummy).toBe(2)
      map.clear()
      expect(dummy).toBe(0)
    })

    it('should be triggered by clearing', () => {
      let dummy
      const map = observable(new Map())
      autorun(() => (dummy = map.get('key')))

      expect(dummy).toBe(undefined)
      map.set('key', 3)
      expect(dummy).toBe(3)
      map.clear()
      expect(dummy).toBe(undefined)
    })

    it('should not observe custom property mutations', () => {
      let dummy
      const map: any = observable(new Map())
      autorun(() => (dummy = map.customProp))

      expect(dummy).toBe(undefined)
      map.customProp = 'Hello World'
      expect(dummy).toBe(undefined)
    })

    it('should not observe non value changing mutations', () => {
      let dummy
      const map = observable(new Map())
      const mapSpy = jest.fn(() => (dummy = map.get('key')))
      autorun(mapSpy)

      expect(dummy).toBe(undefined)
      expect(mapSpy).toHaveBeenCalledTimes(1)
      map.set('key', 'value')
      expect(dummy).toBe('value')
      expect(mapSpy).toHaveBeenCalledTimes(2)
      map.set('key', 'value')
      expect(dummy).toBe('value')
      expect(mapSpy).toHaveBeenCalledTimes(2)
      map.delete('key')
      expect(dummy).toBe(undefined)
      expect(mapSpy).toHaveBeenCalledTimes(3)
      map.delete('key')
      expect(dummy).toBe(undefined)
      expect(mapSpy).toHaveBeenCalledTimes(3)
      map.clear()
      expect(dummy).toBe(undefined)
      expect(mapSpy).toHaveBeenCalledTimes(3)
    })

    it('should not observe raw data', () => {
      let dummy
      const map = observable(new Map())
      autorun(() => (dummy = unwrap(map).get('key')))

      expect(dummy).toBe(undefined)
      map.set('key', 'Hello')
      expect(dummy).toBe(undefined)
      map.delete('key')
      expect(dummy).toBe(undefined)
    })
  })
})