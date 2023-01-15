var fac_memo = [];
function factorial (n) {
  if (n == 0 || n == 1)
    return 1;
  if (fac_memo[n] > 0)
    return fac_memo[n];
  
  if(n > 1e5){
    return NaN
  }

  fac_memo[n] = 1
  for(let i = 1; i <= n; i++){
    fac_memo[n] *= i
  }
  return fac_memo[n];
}

const top_heap = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[top_heap];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top_heap) {
      this._swap(top_heap, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top_heap] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > top_heap && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = top_heap;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

actions_str = [
    // factorial
    x => {
        if(Math.floor(x) != x){
            return `\\left(\\left\\lfloor${x}\\right\\rfloor\\right)!`
        }
        return `\\left(${x}\\right)!`
    },
    // sqrt
    x => `\\sqrt{${x}}`,
    // floor
    x => `\\left\\lfloor${x}\\right\\rfloor`

]

actions = [
    // factorial
    x => {
        return factorial(Math.floor(x))
    },
    // sqrt
    x => Math.sqrt(x),
    // floor
    x => Math.floor(x)
]

class Sol {
    constructor(x,str,steps,end){
        this.steps = steps
        this.x = x;
        this.str = str;
        this.end = end;
    }

    quality(){
        return -(this.steps + 1/(1+Math.exp(-Math.abs(this.end - this.x))))
    }
}

class Sub {
    constructor(end=4){
        this.end = end
        this.queue = new PriorityQueue((a,b) => a.quality() > b.quality())
        /*for(let i = 1; i < end; i++)
            this.queue.push(new Sol(i,i+'',0,end))*/
        //if(end <= 4)
            this.queue.push(new Sol(4,4+'',0,end))
        this.finish = null;
    }
}

function update_display(i,content){
    document.getElementById(`${i}-cost`).innerText = `${String(parseInt(content.x*100)/100).padStart(3, '0')} ${content.steps}`
    katex.render(content.str, document.getElementById(`${i}-latex`), {
        throwOnError: false
    });
    //console.log(i)
}

function end_sub(i){
    document.getElementById(`${i}-latex`).parentElement.className = 'end'
}

function end(sub){
    console.log('finished')
    console.log(sub)
}

function bfs(){
    subproblems = new Array(10).fill(0).map((_x, i) => new Sub(i))

    debugger;

    inter = setInterval(() => {
        all_have_finish = true;
        frames = 10000
        subproblems.forEach((sub, j) => {
            if(!sub.finish){
                all_have_finish = false
                sol = sub.queue.pop()
                //console.log(j)
                if(sol){
                    if(frames > 1000){
                        update_display(j, sol)
                    }
                    if(sol.x == sub.end){
                        sub.finish = sol.str
                    }else if(!isNaN(sol.x) && sol.x != 1){
                        for(let i = 0; i < actions.length; i++){
                          if(!(sol.x == 2 && i == 0 || Math.floor(sol.x) == sol.x && i==2))
                            sub.queue.push(new Sol(actions[i](sol.x), actions_str[i](sol.str),sol.steps+1,sub.end))
                        }
                    }
                }else{
                    /*console.log(subproblems,`${j} is null`)
                    clearInterval(inter)
                    end(subproblems)*/
                }
            }else{
                end_sub(j)
            }

        })
        frames++;
        if(frames > 1000){
            frames = 0
        }
        if(all_have_finish){
            clearInterval(inter)
            end(subproblems)
        }
    }, 1)
}