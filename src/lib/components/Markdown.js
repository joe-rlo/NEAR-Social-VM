import gemoji from "remark-gemoji";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";
import mentions from "./remark/mentions";
import hashtags from "./remark/hashtags";
import widgets from "./remark/widgets";

export const Markdown = (props) => {
  const {
    onLinkClick,
    text,
    onMention,
    onHashtag,
    onWidget,
    syntaxHighlighterProps,
    ...rest
  } = props;
  return (
    <ReactMarkdown
      plugins={[]}
      rehypePlugins={[]}
      remarkPlugins={[gfm, gemoji, mentions, hashtags, widgets]}
      children={text}
      components={{
        strong({ node, children, ...props }) {
          if (onMention && node.properties?.accountId) {
            return onMention(node.properties?.accountId);
          } else if (onHashtag && node.properties?.hashtag) {
            return onHashtag(node.properties?.hashtag);
          } else if (onWidget && node.properties?.url) {
            return onWidget(node.properties);
          }
          return <strong {...props}>{children}</strong>;
        },
        a: ({ node, ...props }) =>
          onLinkClick ? (
            <a onClick={onLinkClick} {...props} />
          ) : props.href && props.href.includes("twitter.com") ? (
            <>
              <blockquote class="twitter-tweet">
                <p lang="en" dir="ltr" />
                <a href={props.href} />
              </blockquote>{" "}
              <script
                async
                src="https://platform.twitter.com/widgets.js"
                charset="utf-8"
              ></script>
            </>
          ) : props.href && props.href.includes("spotify") ? (
            <>
              <iframe
                style={{ borderRadius: "12px" }}
                src={props.href.replace(
                  "open.spotify.com/",
                  "open.spotify.com/embed/"
                )}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                id="spotifyplayer"
              />
            </>
          ) : props.href && props.href.includes("music.apple") ? (
            <>
              <iframe
                src={props.href.replace(
                  "/music.apple.com",
                  "/embed.music.apple.com"
                )}
                allow="autoplay *; encrypted-media *;"
                frameBorder="0"
                height="150"
                style={{
                  width: "100%",
                  maxWidth: "660px",
                  overflow: "hidden",
                  background: "transparent",
                }}
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                id="appleplayer"
              />
            </>
          ) : props.href && props.href.includes("youtube.com/watch") ? (
            (() => {
              const videoId = props.href.match(/v=([^&]+)/)?.[1];
              // Use the video ID in the iframe src
              return (
                <iframe
                  id="ytplayer"
                  type="text/html"
                  height="240px"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  frameBorder="0"
                />
              );
            })()
          ) : props.href && props.href.includes("youtube.com/clip") ? (
            (() => {
              // Use the video ID in the iframe src
              return (
                <>
                  <a href={props.href} target="_blank">
                    <img
                      id="ytclipplayer"
                      src="https://bafkreier7rnyyimqejrfpm7igsxh5gnrwn5sgg2p7elculn7phw5yzrhki.ipfs.nftstorage.link/"
                      frameBorder="0"
                    />
                  </a>
                  <br />
                  <small>
                    <i>We cannot support clips yet, click to view on YouTube</i>
                  </small>
                </>
              );
            })()
          ) : props.href && props.href.includes("youtu.be") ? (
            (() => {
              const videoId = props.href.split("/").pop();
              // Use the video ID in the iframe src
              return (
                <iframe
                  id="ytplayer"
                  type="text/html"
                  height="240px"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  frameBorder="0"
                />
              );
            })()
          ) : props.href && props.href.includes("youtube") ? (
            // Extract the video ID from the YouTube URL
            (() => {
              const videoId = props.href.match(/v=([\w-]{11})/)?.[1];
              // Use the video ID in the iframe src
              return (
                <iframe
                  id="ytplayer"
                  type="text/html"
                  height="240px"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  frameBorder="0"
                />
              );
            })()
          ) : props.href && props.href.includes(".mp4") ? (
            <video id="videoPlayer" width="320" height="240" controls>
              <source src={props.href} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : props.href && props.href.includes(".mov") ? (
            <video id="videoPlayer" width="320" height="240" controls>
              <source src={props.href} type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
          ) : props.href && props.href.includes(".gif") ? (
            // support gif link
            <>
              <img
                src={props.href}
                data-toggle="modal"
                data-target="#imgModal"
              />
              <div
                class="modal fade"
                id="imgModal"
                tabindex="-1"
                role="dialog"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                    <div class="modal-body">
                      <img src={props.href} class="img-fluid" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <a target="_blank" {...props} />
          ),
        img: ({ node, ...props }) => (
          <>
            <img
              className="img-fluid"
              data-toggle="modal"
              data-target="#imgModal"
              {...props}
            />
            <div
              class="modal fade"
              id="imgModal"
              tabindex="-1"
              role="dialog"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-body">
                    <img src={props.href} class="img-fluid" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="blockquote" {...props} />
        ),
        table: ({ node, ...props }) => (
          <table className="table table-striped" {...props} />
        ),
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const { wrapLines, lineProps, showLineNumbers, lineNumberStyle } =
            syntaxHighlighterProps ?? {};

          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              {...{ wrapLines, lineProps, showLineNumbers, lineNumberStyle }}
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};
