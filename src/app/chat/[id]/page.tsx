"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Send, Tag, CheckCircle2, XCircle, ArrowLeft, Loader2, DollarSign, ShieldCheck, Sprout } from "lucide-react";
import Link from "next/link";

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionData = useSession();
  const session = sessionData?.data;

  const chatId = params?.id as string;

  const [chat, setChat] = useState<any | null>(null);
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [sending, setSending] = useState(false);

  // Offer Modal State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerQty, setOfferQty] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    const fetchChatThread = async () => {
      try {
        const res = await fetch(`/api/chat?chatId=${chatId}`);
        const data = await res.json();
        if (data.success) {
          setChat(data.chat);
          setListing(data.listing);
          if (!offerPrice && data.listing) {
            setOfferPrice(String(data.listing.expectedPricePerUnit || ""));
            setOfferQty(String(data.listing.quantity || ""));
          }
        }
      } catch (err) {
        console.error("Error fetching chat thread", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatThread();
    const interval = setInterval(fetchChatThread, 4000);
    return () => clearInterval(interval);
  }, [chatId, offerPrice]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textInput.trim() || sending) return;

    try {
      setSending(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          text: textInput.trim(),
          isOffer: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTextInput("");
        setChat(data.chat);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleSendOffer = async () => {
    if (!offerPrice || !offerQty || submittingOffer) return;

    try {
      setSubmittingOffer(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          isOffer: true,
          offerAmount: Number(offerPrice),
          offerQuantity: Number(offerQty),
          text: `Formal Offer Proposal: ₹${offerPrice} / ${listing?.unit || "Quintal"} for ${offerQty} ${listing?.unit || "Quintal"}s`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowOfferModal(false);
        setChat(data.chat);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleRespondToOffer = async (offerIndex: number, action: "accept_offer" | "reject_offer") => {
    try {
      const res = await fetch("/api/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          action,
          offerIndex,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setChat(data.chat);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignAgreement = async () => {
    try {
      const res = await fetch("/api/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          action: "agree",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setChat(data.chat);
        if (data.contractGenerated && data.contract) {
          router.push(`/contracts/${data.contract._id}`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="flex items-center gap-3 text-lg font-medium text-slate-300">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            Connecting to Direct Negotiation Room...
          </div>
        </main>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-24 text-center">
          <Card className="bg-slate-900 border-slate-800 p-8">
            <CardContent>
              <h2 className="text-xl font-bold text-white mb-2">Chat Room Not Found</h2>
              <p className="text-slate-400 mb-6">This negotiation session does not exist or you do not have permission to view it.</p>
              <Link href="/bdashboard/marketplace">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">Back to Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentUserEmail = session?.user?.email;
  const isFarmer = currentUserEmail === chat.farmerEmail;
  const userAgreed = isFarmer ? chat.farmerAgreed : chat.buyerAgreed;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      {/* Sleek Agricultural Radial Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-600/15 blur-[120px] rounded-full pointer-events-none -z-0" />
      <div className="absolute top-[300px] right-0 w-[500px] h-[350px] bg-amber-600/10 blur-[130px] rounded-full pointer-events-none -z-0" />

      {/* Background image overlay */}
      <div className="absolute inset-0 bg-[url('/resources/background4.jpeg')] bg-cover bg-center opacity-15 pointer-events-none -z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950 pointer-events-none -z-0" />

      <Header />

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-20 flex flex-col h-[calc(100vh-70px)] relative z-10">
        
        {/* Main Chat Panel Container */}
        <div className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden">
          
          {/* Chat Room Header */}
          <div className="bg-slate-950 border-b border-slate-700 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <Link
                href={isFarmer ? "/fdashboard/listing" : "/bdashboard/marketplace"}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-emerald-400" />
                    {chat.cropName} Negotiation
                  </h1>
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-300 bg-emerald-950/80 text-xs font-bold px-2.5 py-0.5">
                    {isFarmer ? "Buyer: " + chat.buyerName : "Farmer: " + chat.farmerName}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  {listing ? `Listed Price: ₹${listing.expectedPricePerUnit}/${listing.unit || "Quintal"} • Total: ${listing.quantity} units` : "Negotiating Deal Terms"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => setShowOfferModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5"
              >
                <DollarSign className="h-4 w-4" /> Propose Offer
              </Button>

              <Button
                size="sm"
                onClick={handleSignAgreement}
                disabled={userAgreed}
                className={
                  userAgreed
                    ? "bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold text-xs px-4 py-2 rounded-xl"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5"
                }
              >
                <CheckCircle2 className="h-4 w-4" />
                {userAgreed ? "Signed & Confirmed ✓" : "Sign Deal & Generate Contract"}
              </Button>
            </div>
          </div>

          {/* Agreement Status Banner */}
          {(chat.farmerAgreed || chat.buyerAgreed) && (
            <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-200 font-bold shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>
                  Agreement Status: Farmer ({chat.farmerAgreed ? "Signed ✓" : "Pending"}) • Buyer ({chat.buyerAgreed ? "Signed ✓" : "Pending"})
                </span>
              </div>
              {chat.farmerAgreed && chat.buyerAgreed && (
                <span className="font-extrabold text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/40">
                  Digital Contract Auto-Generated!
                </span>
              )}
            </div>
          )}

          {/* Message Thread Scroll Area */}
          <div className="flex-1 bg-slate-950/80 overflow-y-auto p-4 sm:p-6 space-y-4">
            {chat.messages.length === 0 ? (
              <div className="text-center py-20 text-slate-300 font-medium text-sm">
                No messages yet. Send a message or propose a price offer to start negotiating!
              </div>
            ) : (
              chat.messages.map((msg: any, idx: number) => {
                const isMe = msg.senderEmail === currentUserEmail;

                if (msg.isOffer) {
                  return (
                    <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <Card className="max-w-md w-full bg-slate-950 border-2 border-amber-500/60 shadow-2xl rounded-2xl overflow-hidden">
                        <CardHeader className="pb-2 pt-4 px-4 bg-slate-900/80 border-b border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                              <Tag className="h-4 w-4" /> Price Offer Proposal
                            </span>
                            <Badge
                              className={
                                msg.offerStatus === "Accepted"
                                  ? "bg-emerald-600 text-white font-bold"
                                  : msg.offerStatus === "Rejected"
                                  ? "bg-red-600 text-white font-bold"
                                  : "bg-amber-600 text-white font-bold"
                              }
                            >
                              {msg.offerStatus || "Pending"}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-300 font-medium mt-1">From {msg.senderName || msg.senderEmail}</p>
                        </CardHeader>

                        <CardContent className="px-4 py-4 space-y-3">
                          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-700 flex items-center justify-between">
                            <div>
                              <p className="text-[11px] text-slate-300 font-bold uppercase">Offered Price</p>
                              <p className="text-2xl font-black text-emerald-400">₹{msg.offerAmount} <span className="text-xs text-slate-300 font-normal">/ {listing?.unit || "Quintal"}</span></p>
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] text-slate-300 font-bold uppercase">Quantity</p>
                              <p className="text-lg font-black text-white">{msg.offerQuantity} {listing?.unit || "Quintal"}</p>
                            </div>
                          </div>

                          <div className="text-xs text-slate-200 font-semibold flex justify-between items-center border-t border-slate-800 pt-2">
                            <span>Total Deal Value:</span>
                            <span className="text-white font-black text-base">₹{(msg.offerAmount * msg.offerQuantity).toLocaleString("en-IN")}</span>
                          </div>

                          {!isMe && msg.offerStatus === "Pending" && (
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRespondToOffer(idx, "reject_offer")}
                                className="w-1/2 border-rose-600 bg-rose-950/60 text-rose-300 hover:bg-rose-900 hover:text-white font-bold text-xs py-2"
                              >
                                <XCircle className="h-4 w-4 mr-1" /> Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleRespondToOffer(idx, "accept_offer")}
                                className="w-1/2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2 shadow-lg"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Accept Terms
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  );
                }

                return (
                  <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-md rounded-2xl px-4 py-3 text-sm shadow-xl ${
                        isMe
                          ? "bg-emerald-600 text-white border border-emerald-400/40 rounded-br-none"
                          : "bg-slate-800 text-white border border-slate-600/80 rounded-bl-none"
                      }`}
                    >
                      <p className={`text-xs font-black mb-1 ${isMe ? "text-emerald-100" : "text-amber-400"}`}>
                        {isMe ? "You" : msg.senderName}
                      </p>
                      <p className="whitespace-pre-wrap font-medium text-slate-100">{msg.text}</p>
                      <p className={`text-[10px] text-right mt-1.5 font-mono font-bold ${isMe ? "text-emerald-100" : "text-slate-300"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Bottom Bar */}
          <form onSubmit={handleSendMessage} className="bg-slate-950 border-t border-slate-700 p-3.5 flex items-center gap-3 shrink-0">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your negotiation message or terms..."
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-400 h-12 text-sm focus:border-emerald-500 rounded-xl"
            />
            <Button
              type="submit"
              disabled={sending || !textInput.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold h-12 w-12 rounded-xl flex items-center justify-center shadow-lg shrink-0"
            >
              {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        </div>

        {/* Offer Modal */}
        <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
          <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-md shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-white font-extrabold text-xl flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-amber-400" /> Propose Formal Price Offer
              </DialogTitle>
              <DialogDescription className="text-slate-300 text-xs">
                Submit an explicit price and quantity proposal for this produce listing.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-xs text-slate-200 font-bold uppercase">Offered Price (₹ per {listing?.unit || "Quintal"})</label>
                <Input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="e.g. 2350"
                  className="bg-slate-950 border-slate-700 text-white h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-200 font-bold uppercase">Quantity ({listing?.unit || "Quintal"}s)</label>
                <Input
                  type="number"
                  value={offerQty}
                  onChange={(e) => setOfferQty(e.target.value)}
                  placeholder="e.g. 500"
                  className="bg-slate-950 border-slate-700 text-white h-11"
                />
              </div>

              {offerPrice && offerQty && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-medium">Total Calculation:</span>
                  <span className="text-emerald-400 font-black text-lg">₹{(Number(offerPrice) * Number(offerQty)).toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setShowOfferModal(false)} className="text-slate-300 hover:text-white">Cancel</Button>
              <Button onClick={handleSendOffer} disabled={submittingOffer} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold">
                {submittingOffer ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Formal Offer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
