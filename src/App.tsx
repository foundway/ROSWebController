import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import './App.css'

// Custom hook for ROS connection management
const useROSConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<'N/A' | 'successful' | 'errored out' | 'closed' | string>('N/A')
  const [ros, setRos] = useState<any>(null)

  useEffect(() => {
    console.log('useROSConnection: Initializing ROS connection to ws://192.168.86.57:9091')
    // Create ros object to communicate over Rosbridge connection
    const rosInstance = new (window as any).ROSLIB.Ros({ 
      url: "ws://192.168.86.57:9091" 
    })

    console.log('useROSConnection: ROS instance created, setting up event listeners')
    // When the Rosbridge server connects
    rosInstance.on("connection", () => {
      console.log('useROSConnection: Connection successful')
      setConnectionStatus("successful")
    })

    // When the Rosbridge server experiences an error
    rosInstance.on("error", (error: any) => {
      console.log('useROSConnection: Connection error:', error)
      setConnectionStatus(`errored out (${error})`)
    })

    // When the Rosbridge server shuts down
    rosInstance.on("close", () => {
      console.log('useROSConnection: Connection closed')
      setConnectionStatus("closed")
    })

    setRos(rosInstance)
    console.log('useROSConnection: ROS instance set in state')

    // Cleanup function
    return () => {
      console.log('useROSConnection: Cleaning up ROS connection')
      if (rosInstance) {
        rosInstance.close()
      }
    }
  }, [])

  return { connectionStatus, ros }
}

const Box = () => {
  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

const BasicScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Box />
      <OrbitControls />
    </>
  )
}

const TopicListener = ({ ros }: { ros: any }) => {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    console.log('TopicListener: ROS instance:', ros)
    if (!ros) {
      console.log('TopicListener: No ROS instance available')
      return
    }

    console.log('TopicListener: Creating topic listener for /my_topic')
    // Create a listener for /my_topic
    const myTopicListener = new (window as any).ROSLIB.Topic({
      ros,
      name: "/my_topic",
      messageType: "std_msgs/String",
    })

    console.log('TopicListener: Subscribing to /my_topic')
    // When we receive a message on /my_topic, add it to the messages array
    myTopicListener.subscribe((message: any) => {
      console.log('TopicListener: Received message:', message)
      setMessages(prev => [...prev, message.data])
    })

    // Check if topic exists
    console.log('TopicListener: Checking if /my_topic exists...')
    ros.getTopics((result: any) => {
      console.log('TopicListener: Available topics:', result.topics)
      console.log('TopicListener: Topic types:', result.types)
    }, (error: any) => {
      console.log('TopicListener: Error getting topics:', error)
    })

    // Cleanup function
    return () => {
      console.log('TopicListener: Unsubscribing from /my_topic')
      myTopicListener.unsubscribe()
    }
  }, [ros]) // This dependency is crucial!

  return (
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold mb-3">Topic Listener</h3>
      <p className="text-sm text-slate-400 mb-3">
        Listening to <code className="bg-slate-700 px-2 py-1 rounded">/my_topic</code>
      </p>
      <div className="max-w-md mx-auto">
        <p className="text-sm text-slate-300 mb-2">
          Messages received: <span className="font-bold">{messages.length}</span>
        </p>
        {messages.length > 0 ? (
          <ul className="text-left bg-slate-800 rounded-lg p-4 max-h-32 overflow-y-auto">
            {messages.map((message, index) => (
              <li key={index} className="text-green-400 mb-1">
                {message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 italic">No messages received yet</p>
        )}
        
        {/* Test Button */}
        <button 
          onClick={() => {
            if (ros) {
              console.log('TopicListener: Publishing test message...')
              const testTopic = new (window as any).ROSLIB.Topic({
                ros,
                name: "/my_topic",
                messageType: "std_msgs/String",
              })
              testTopic.publish({ data: `Test message ${Date.now()}` })
              console.log('TopicListener: Test message published')
            }
          }}
          className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
        >
          Send Test Message
        </button>
      </div>
    </div>
  )
}

const App = () => {
  const [isAdvanced, setIsAdvanced] = useState(false)
  const { connectionStatus, ros } = useROSConnection()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2">ROS Web Controller</h1>
        <p className="text-center text-slate-300 mb-8">By Fang Lee</p>
        
        {/* ROS Connection Status */}
        <div className="text-center mb-6">
          <p className="text-lg">
            ROS Connection: <span className="font-bold" style={{
              color: connectionStatus === 'successful' ? '#10b981' : 
                     connectionStatus === 'errored out' ? '#ef4444' : 
                     connectionStatus === 'closed' ? '#f59e0b' : '#6b7280'
            }}>
              {connectionStatus}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center gap-8 p-12">
          <TopicListener ros={ros} />
          <Slider defaultValue={[50]} max={100} min={0} onValueChange={(value) => {
            if (ros) {
              const motionCommandTopic = new (window as any).ROSLIB.Topic({
                ros,
                name: "motion/command",
                messageType: "ainex_interfaces/MotionCommand",
              })
              motionCommandTopic.publish({
                servo_id: [13], 
                position: [Math.round(value[0]*10)], // Convert to integer
                duration: [1000]
              })
              console.log('Published motion command:', {
                servo_id: [13], 
                position: [Math.round(value[0]*10)], 
                duration: [1000]
              })
            }
            console.log('Slider value:', value)
          }} />
        </div>
        <div className="flex justify-center mb-6">
          <Button 
            onClick={() => setIsAdvanced(!isAdvanced)}
            variant="default"
            size="lg"
            className="bg-white/10 text-white hover:bg-white/20 px-12 py-4"
          >
            {isAdvanced ? 'Show Basic Scene' : 'Show Advanced Scene'}
          </Button>
        </div>
        <div className="w-full h-[80vh] rounded-lg overflow-hidden border border-white/20">
          <Canvas camera={{ position: [3, 2, 3] }}>
            <Suspense fallback={null}>
              <BasicScene />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  )
}

export default App
