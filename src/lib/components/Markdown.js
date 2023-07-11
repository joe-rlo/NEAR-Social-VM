import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";
import mentions from "./remark/mentions";
import hashtags from "./remark/hashtags";

export const Markdown = (props) => {
  const { onLinkClick, text, onMention, onHashtag, syntaxHighlighterProps } =
    props;
  return (
    <ReactMarkdown
      plugins={[]}
      rehypePlugins={[]}
      remarkPlugins={[gfm, mentions, hashtags]}
      children={text}
      components={{
        strong({ node, children, ...props }) {
          if (onMention && node.properties?.accountId) {
            return onMention(node.properties?.accountId);
          } else if (onHashtag && node.properties?.hashtag) {
            return onHashtag(node.properties?.hashtag);
          }
          return <strong {...props}>{children}</strong>;
        },
        a: ({ node, ...props }) =>
          onLinkClick ? (
            <a onClick={onLinkClick} {...props} />
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
          ) : props.href && props.href.includes("youtube.com/watch") ? (
            (() => {
              const videoId = props.href.match(/v=([^&]+)/)?.[1];
              // Use the video ID in the iframe src
              return (
                <iframe
                  id="ytplayer"
                  type="text/html"
                  height="480px"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                />
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
                  height="480px"
                  src={`https://www.youtube.com/embed/${videoId}`}
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
                  height="480px"
                  src={`https://www.youtube.com/embed/${videoId}`}
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
