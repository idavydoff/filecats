use std::net::SocketAddr;

use bstr::ByteSlice;
use futures_util::stream::SplitSink;
use tokio::net::TcpStream;
use tokio_tungstenite::{tungstenite::Message, WebSocketStream};

pub struct UserFileMessage {
  pub username: String,
  pub file_name: String,
  pub file_type: String,
  pub file_bytes: Vec<u8>,
}

impl UserFileMessage {
  pub fn from(data: Vec<u8>) -> Option<Self> {
    let pattern: [u8; 12] = [226, 128, 147, 226, 128, 147, 226, 128, 147, 226, 128, 147]; 
    
    let result: Vec<Vec<u8>> = data.split_str(&pattern).map(|x|x.to_vec()).filter(|x| x.len() > 0).collect();
    
    if result.len() == 4 {
      let username = String::from_utf8_lossy(&result[0]).to_string();
      let file_name = String::from_utf8_lossy(&result[1]).to_string();
      let file_type = String::from_utf8_lossy(&result[2]).to_string();
      
      let file_bytes = result[3].clone();
      
      Some(UserFileMessage { username, file_name, file_type, file_bytes })
    } else {
      None
    }
  }
}

#[derive(Debug)]
pub struct Connection {
  pub id: u32,
  pub addr: SocketAddr,
  pub con: SplitSink<WebSocketStream<TcpStream>, Message>,
}

#[derive(Debug)]
pub enum BroadcastEvents {
  AddConn(Connection),
  Join(String),
  Quit(u32, String),
  SendFile(Message)
}
