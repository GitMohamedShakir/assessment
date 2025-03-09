'use client'
import LiveEditor from "@/components/LiveEditor";
import withWebSocket, { IWebSocketProps } from "@/hoc/withWebSocket";

const App = ({ socketData, sendMessage }: IWebSocketProps) => {
  return (
    <div>
      <LiveEditor editorData={socketData} sendEditorData={sendMessage} />
    </div>
  );
};

export default withWebSocket(App);
