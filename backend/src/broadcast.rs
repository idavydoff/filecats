use std::collections::HashMap;

use futures_util::SinkExt;
use tokio::sync::mpsc::UnboundedReceiver;
use tokio_tungstenite::tungstenite::Message;

use crate::types::{BroadcastEvents, Connection};

pub async fn run(mut rx: UnboundedReceiver<BroadcastEvents>) {
  let mut connections: HashMap<u32, Connection> = HashMap::new();

  while let Some(event) = rx.recv().await {
    match event {
      BroadcastEvents::AddConn(conn) => {
        connections.insert(conn.id, conn);
      }
      BroadcastEvents::Join(username) => {
        for (_, iconn) in connections.iter_mut() {
          let _ = iconn.con.send(Message::Text(format!("JOIN|{}", username))).await;
        }
      }
      BroadcastEvents::Quit(id, username) => {
        connections.remove(&id);

        if !username.is_empty() {
          for (_, conn) in connections.iter_mut() {
            let _ = conn.con.send(Message::Text(format!("LEFT|{}", username))).await;
          }
        }
      }
      BroadcastEvents::SendFile(msg) => {
        for (_, conn) in connections.iter_mut() {
          let _ = conn.con.send(msg.clone()).await;
        }
      }
    }
  }
}