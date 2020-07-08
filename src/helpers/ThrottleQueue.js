// Allows functions to be called at a throttled rate
export class ThrottleQueue {
  constructor (limit = 1000) {
    this.limit = limit;
    this.ready = true;
    this.queue = [];
  }

  // Adds a function to the queue
  add(fn) {
    this.queue.push(fn);
    this.processQueue();
  }

  // Calls the oldest function from the queue, if one exists 
  processQueue() {
    if (this.queue.length > 0 && this.ready) {
      this.ready = false;
      this.queue.shift()();
      setTimeout(this.refresh.bind(this), this.limit);
    }
  }

  // Called when the cooldown finishes, processes next function
  refresh() {
    this.ready = true;
    this.processQueue();
  }
}

export default ThrottleQueue;
