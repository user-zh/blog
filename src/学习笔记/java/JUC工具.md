---
title: java中JUC工具
order: 1
date: 2025-02-24
isOriginal: false
category:
  - java
tags:
  - juc
---

## 锁
### AQS（AbstractQueuedSynchronizer）
**AQS思想**：如果一个线程获取空闲共享资源，会给资源上锁。如果线程访问的资源被锁定，则会阻塞等待资源空闲被唤醒（通过**CLH队列锁**实现）。

上锁：尝试将状态值修改成1，如果成功则将目前线程设置成独占线程；如果失败，会再次尝试修改值（自旋）和比较目前线程是否就是独占线程（重入锁），如果还是失败则进入到等待队列中挂起线程（死循环）。

解锁：判断目前线程是否为独占线程，如果是则将状态设置为0和独占线程设置成null，再head指向不为空的情况下唤醒队列中head.next节点线程

> CLH队列锁是一个虚拟的双向队列（不存在队列实例，仅存在节点间关联关系）
>

**AQS资源共享方式**：

1. 独占：只有一个线程能获取，采用公平和非公平策略
2. 共享：多个线程享有，常见的有工具类CountDownLatch

**源码概述**

1. AbstractQueuedSynchronizer继承AbstractOwnableSynchronizer(设置和设置独占线程)
2. AbstractQueuedSynchronizer内部设置Node类（定义目前线程节点信息，记录前后节点关系和状态）
3. 内置类ConditionObject（对Node节点操作，记录头尾节点如入队出等待队，线程等待和唤醒）
4. AbstractQueuedSynchronizer属性说明
    1. volatile int state（状态，1：上锁，0：未上锁）
    2. volatile Node head（头部，是一个存放空的节点，next指向队列第一个线程节点）
    3. volatile Node tail（尾部，指向尾部节点）

### ReentrantLock（可重入锁）
```java
// 设置为公平锁（默认是非公平）
Lock lock = new ReentrantLock(true);
lock.lock();
try {
    System.out.println(Thread.currentThread() + " running");
    try {
        Thread.sleep(500);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
} finally {
    lock.unlock();
}

```

## 集合
### ConcurrentHashMap
1. HashTable慢的原因：使用synchronized关键字对put操作加锁，锁住了整个Hash表操作。
2. ConcurrentHashMap引入Segment数组（段），将HashTable分成多段，减轻锁的粒度

### CopyOnWriteArrayList
使用ReentrantLock实现

## 线程池
### FutureTask(Callable接口使用)
可以获取任务执行结果(get)和取消任务(cancel)等。如果任务尚未完成，获取任务执行结果时将会阻塞。一旦执行结束，任务就不能被重启或取消(除非使用runAndReset执行计算)。

```java
import java.util.concurrent.*;
 
public class CallDemo {
 
    public static void main(String[] args) throws ExecutionException, InterruptedException {
 
        /**
         * 第一种方式:Future + ExecutorService
         * Task task = new Task();
         * ExecutorService service = Executors.newCachedThreadPool();
         * Future<Integer> future = service.submit(task1);
         * service.shutdown();
         */
 
 
        /**
         * 第二种方式: FutureTask + ExecutorService
         * ExecutorService executor = Executors.newCachedThreadPool();
         * Task task = new Task();
         * FutureTask<Integer> futureTask = new FutureTask<Integer>(task);
         * executor.submit(futureTask);
         * executor.shutdown();
         */
 
        /**
         * 第三种方式:FutureTask + Thread
         */
 
        // 2. 新建FutureTask,需要一个实现了Callable接口的类的实例作为构造函数参数
        FutureTask<Integer> futureTask = new FutureTask<Integer>(new Task());
        // 3. 新建Thread对象并启动
        Thread thread = new Thread(futureTask);
        thread.setName("Task thread");
        thread.start();
 
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
 
        System.out.println("Thread [" + Thread.currentThread().getName() + "] is running");
 
        // 4. 调用isDone()判断任务是否结束
        if(!futureTask.isDone()) {
            System.out.println("Task is not done");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        int result = 0;
        try {
            // 5. 调用get()方法获取任务结果,如果任务没有执行完成则阻塞等待
            result = futureTask.get();
        } catch (Exception e) {
            e.printStackTrace();
        }
 
        System.out.println("result is " + result);
 
    }
 
    // 1. 继承Callable接口,实现call()方法,泛型参数为要返回的类型
    static class Task  implements Callable<Integer> {
 
        @Override
        public Integer call() throws Exception {
            System.out.println("Thread [" + Thread.currentThread().getName() + "] is running");
            int result = 0;
            for(int i = 0; i < 100;++i) {
                result += i;
            }
 
            Thread.sleep(3000);
            return result;
        }
    }
}
```

### ThreadPoolExecutor
参数说明

```java
public ThreadPoolExecutor(
    // 核心线程数
    int corePoolSize,
    // 最大线程数
    int maximumPoolSize,
    // 空闲线程存活时间，当大于corePoolSize时多余空闲线程存活时间
    long keepAliveTime,
    // 时间单位
    TimeUnit unit,
    // 队列
    // ArrayBlockingQueue：基于数组有界阻塞队列，FIFO排序队列
    // LinkedBlockingQueue：基于链表结构的阻塞队列，插入删除效率高，吞吐高于ArraryBlockingQueue
    // SynchronousQueue：(无锁)不存储的阻塞队列，线程只能在前一个被移除才能插入，否则会一直阻塞，吞吐高于LinkedBlockingQueue
    // PriorityBlockingQueue：具有优先级的无边界阻塞队列
    BlockingQueue<Runnable> workQueue,
    // 拒绝策略
    // AbortPolicy: 直接抛出异常，默认策略
    // CallerRunsPolicy: 用调用者所在的线程来执行任务
    // DiscardOldestPolicy: 丢弃阻塞队列中靠最前的任务，并执行当前任务
    // DiscardPolicy: 直接丢弃任务
    RejectedExecutionHandler handler)
```

线程池创建：

+ CPU密集型: 尽可能少的线程，Ncpu+1
+ IO密集型: 尽可能多的线程, Ncpu*2，比如数据库连接池
+ 混合型: CPU密集型的任务与IO密集型任务的执行时间差别较小，拆分为两个线程池；否则没有必要拆分。

### ForkJoinTask、ForkJoinPool(并行任务、并行线程池、分治算法)
Fork/Join框架主要包含三个模块:

+ 任务对象: `ForkJoinTask` (包括`RecursiveTask（有返回值递归任务）`、`RecursiveAction（无返回值递归任务）` 和 `CountedCompleter（任务完成执行后会触发执行一个自定义的钩子函数）`)
+ 执行Fork/Join任务的线程: `ForkJoinWorkerThread`
+ 线程池: `ForkJoinPool`

```java
public class Test {

    public static void main(String[] args){
        // 创建并行线程（默认是根据计算机cpu核心创建线程数）
        ForkJoinPool forkJoinPool = new ForkJoinPool();
        // 定义并行任务
        ForkJoinTask<Integer> task = new Task(0, 1000);
        // 执行
        Integer sum = forkJoinPool.invoke(task);
        System.out.println(sum);
    }
}

class Task extends RecursiveTask<Integer> {
    private int start;
    private int end;

    public Task(int start, int end) {
        this.start = start;
        this.end = end;
    }

    @Override
    protected Integer compute() {
        // 如果规模小于100，计算合计
        if (end - start <= 100){
            int sum = 0;
            for (int i = start; i <= end; i++) {
                sum += i;
            }
            return sum;
        }
        // 利用二分法均分任务规模（递归）
        int middle = (start+end)/2;
        Task task1 = new Task(start,middle);
        Task task2 = new Task(middle+1,end);
        // 并行执行任务
        task1.fork();
        task2.fork();
        // 阻塞等待子任务执行完
        return task1.join()+task2.join();
    }
}
```

### <font style="color:rgb(44, 62, 80);">ScheduledFuture、ScheduledThreadPoolExecutor（周期任务、周期线程池）</font>
执行周期性任务

```java
public static void main(String[] args) {
        ScheduledThreadPoolExecutor scheduler = new ScheduledThreadPoolExecutor(2);
        // 延迟执行任务
        scheduler.schedule(() -> {
            System.out.println("延迟 5 秒执行的任务");
        }, 5, TimeUnit.SECONDS);

        // 固定速率执行任务,intialDelay 表示首次执行延迟时间，period 表示两次执行间隔时间
        ScheduledFuture<?> scheduledFuture = scheduler.scheduleAtFixedRate(() -> {
            System.out.println("固定速率任务，每隔 2 秒执行一次");
        }, 1, 2, TimeUnit.SECONDS);

        // 固定延迟执行任务
        scheduler.scheduleWithFixedDelay(() -> {
            System.out.println("固定延迟任务，每次任务结束后延迟 3 秒再执行");
        }, 1, 2, TimeUnit.SECONDS);

        try {
            Thread.sleep(4000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        // 取消固定速率执行任务
        scheduledFuture.cancel(true);
        System.out.println("固定速率任务已取消");

        try {
            Thread.sleep(4000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        // 关闭线程池
        scheduler.shutdown();
    }
```

### CompleteFuture（异步完成多任务）
```java
// 异步完成任务
runAsync(Runnable runnable,Executor executor)
supplyAsync(Supplier<U> supplier, Executor executor)

// 任务结果处理
CompletableFuture<U> thenApply(Function<? super T,? extends U> fn) 
CompletableFuture<Void> thenAccept(Consumer<? super T> action)
// 合并两个线程任务的结果，并进一步处理。
CompletableFuture<V> thenCombine(CompletionStage<? extends U> other, BiFunction<? super T,? super U,? extends V> fn)

// 多个CompleteFuture并行控制
// 全部CompletableFuture同时返回
CompletableFuture<Void> allOf(CompletableFuture<?>... cfs)
// 当其中的任何一个CompletableFuture完成时返回完成这个CompletableFuture
CompletableFuture<Object> anyOf(CompletableFuture<?>... cfs)
```

```java
public static void main(String[] args) {
    // 创建线程池
    ExecutorService executor = Executors.newFixedThreadPool(10);

    // 1. 创建一个CompletableFuture对象，并指定一个异步操作，然后打印"hello world"。
    CompletableFuture.runAsync(() -> System.out.println(Thread.currentThread().getName() + ":" +"hello world"), executor);

    // 2. 创建一个CompletableFuture对象，并指定一个异步操作，然后获取结果并打印。
    CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
        System.out.println(Thread.currentThread().getName() + ":" +"hello world");
        return "hello world";
        }, executor);
    // 阻塞等待获取结果
    try {
        System.out.println(Thread.currentThread().getName() + ":" +future.get());
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    } catch (ExecutionException e) {
        throw new RuntimeException(e);
    }

    // 3. 按顺序执行两个异步操作，并获取结果。
    CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> {
        System.out.println(Thread.currentThread().getName() + ":" +"hello world");
        return "hello world";
    }, executor);
    // 按顺序执行
    CompletableFuture<String> future2 = future1.thenApplyAsync(s -> s + ", how are you?", executor);
    // 按顺序合并执行
    CompletableFuture<String> future3 = future1.thenCombineAsync(future2, (s1, s2) -> {
        System.out.println(Thread.currentThread().getName() + ":" +s1 +", "+ s2);
        return s1 +", "+ s2;
    }, executor);
    try {
        System.out.println(Thread.currentThread().getName() + ":" +future2.get());
        System.out.println(Thread.currentThread().getName() + ":future3:" +future3.get());
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    } catch (ExecutionException e) {
        throw new RuntimeException(e);
    }

    // 4.异常处理(一般用于业务中)
    CompletableFuture.supplyAsync(() -> {
        if (true) {
            throw new RuntimeException("error");
        }
        return "hello world";
    }, executor).whenComplete((s, t) -> {
        // 处理异常
        if (t != null) {
            System.out.println(Thread.currentThread().getName() + ":" +"exception:" + t.getMessage());
        } else {
            // 处理正常结果
            System.out.println(Thread.currentThread().getName() + ":" +s);
        }
    });

    try {
        // 等待所有任务完成
        executor.shutdown();
        executor.awaitTermination(1, TimeUnit.DAYS);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```

## 工具类
### CountDownLatch（倒计时锁）
将一个程序分为n个互相独立的可解决任务，然后定义n个countDownLatch。当所有任务都countDown()，await（）的线程才会运行。

```java
/**
 * 使用CountDownLatch 代替wait notify 好处是通讯方式简单，
 不涉及锁定 Count 值为0时当前线程继续执行
 */
public class T3 {
   public static void main(String[] args) {
        //Object lock = new Object();
        T2 t2 = new T2();
        CountDownLatch countDownLatch = new CountDownLatch(1);
        // 设置进度任务0-9
        new Thread(() -> {
            Thread.yield();
            //synchronized (lock) {
                System.out.println("t1 启动");
                for (int i = 0; i < 9; i++) {
                    t2.add(i);
                    System.out.println("添加了" + i);
                    if (t2.getSize() == 5){
                        // 唤醒监听线程，目前线程继续执行
                        countDownLatch.countDown();
                        /*lock.notify();
                        try {
                            lock.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }*/
                    }
                }
            //}
        }, "t1").start();
        // 设置监听线程，当进度到5的时候输出（没有到则阻塞住等待唤醒）
        new Thread(() -> {
            //synchronized (lock) {
                System.out.println("t2 启动");
                if (t2.getSize() != 5){
                    try {
                        // 阻塞住
                        countDownLatch.await();
                        System.out.println("t2 结束");
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                    /*try {
                        lock.wait();
                        System.out.println("t2 结束");
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                    lock.notify();*/
                }
            //}
        },"2").start();
    }
    
    static class T2 {
        // 因为只有一个线程在操作（不存在并发），直接用ArrayList
        volatile List list = new ArrayList();

        public void add(int i) {
            list.add(i);
        }

        public int getSize() {
            return list.size();
        }
    }

}
```

### CyclicBarrier（篱栅）
多个线程await（）阻塞，当阻塞线程数到达设置关联线程数再继续执行。（PS:可以反复阻塞使用）

```java
class MyThread extends Thread {
    private CyclicBarrier cb;
    public MyThread(String name, CyclicBarrier cb) {
        super(name);
        this.cb = cb;
    }
    
    public void run() {
        System.out.println(Thread.currentThread().getName() + " going to await");
        try {
            // 阻塞
            cb.await();
            System.out.println(Thread.currentThread().getName() + " continue");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
public class CyclicBarrierDemo {
    public static void main(String[] args) throws InterruptedException, BrokenBarrierException {
        // 设置关联线程数(2个子线程+1个主线程)和同步方法
        CyclicBarrier cb = new CyclicBarrier(3, new Thread("barrierAction") {
            public void run() {
                System.out.println(Thread.currentThread().getName() + " barrier action");
                
            }
        });
        MyThread t1 = new MyThread("t1", cb);
        MyThread t2 = new MyThread("t2", cb);
        t1.start();
        t2.start();
        System.out.println(Thread.currentThread().getName() + " going to await");
        // 阻塞等待
        cb.await();
        System.out.println(Thread.currentThread().getName() + " continue");

    }
}
```

## ThreadLocal
作用：存储目前线程变量

线程隔离：Thread中存中一个ThreadLocalMap成员,用于存放变量

### 线程池内存泄漏问题
原因：线程池中线程不会被消化，ThreadLocalMap中引用对象的key因为是弱引用会被gc清理，而对应值是强引用类型不会被gc回收

解决方案：线程使用完用remove方法清理

